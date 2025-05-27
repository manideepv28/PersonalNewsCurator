import express from 'express';
import serverless from 'serverless-http';
import { storage } from '../../server/storage.js';
import { insertUserSchema, loginSchema } from '../../shared/schema.js';
import { z } from 'zod';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers for Netlify
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Authentication routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const user = await storage.createUser(userData);
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const credentials = loginSchema.parse(req.body);
    
    const user = await storage.getUserByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Articles routes
app.get("/api/articles", async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let articles;
    if (search) {
      articles = await storage.searchArticles(search);
    } else if (category && category !== "all") {
      articles = await storage.getArticlesByCategory(category);
    } else {
      articles = await storage.getAllArticles();
    }
    
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Saved articles routes
app.get("/api/saved-articles/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const savedArticles = await storage.getSavedArticles(userId);
    res.json(savedArticles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/saved-articles", async (req, res) => {
  try {
    const { userId, articleId } = req.body;
    
    if (!userId || !articleId) {
      return res.status(400).json({ message: "User ID and Article ID are required" });
    }
    
    // Check if already saved
    const isAlreadySaved = await storage.isArticleSaved(userId, articleId);
    if (isAlreadySaved) {
      return res.status(400).json({ message: "Article already saved" });
    }
    
    const savedArticle = await storage.saveArticle({ userId, articleId });
    res.json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/saved-articles/:userId/:articleId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const articleId = parseInt(req.params.articleId);
    
    if (isNaN(userId) || isNaN(articleId)) {
      return res.status(400).json({ message: "Invalid user ID or article ID" });
    }
    
    const success = await storage.unsaveArticle(userId, articleId);
    if (success) {
      res.json({ message: "Article unsaved successfully" });
    } else {
      res.status(404).json({ message: "Saved article not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if article is saved
app.get("/api/saved-articles/:userId/:articleId/check", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const articleId = parseInt(req.params.articleId);
    
    if (isNaN(userId) || isNaN(articleId)) {
      return res.status(400).json({ message: "Invalid user ID or article ID" });
    }
    
    const isSaved = await storage.isArticleSaved(userId, articleId);
    res.json({ isSaved });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// User profile routes
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const updateData = req.body;
    const updatedUser = await storage.updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error('Server error:', err);
});

export const handler = serverless(app);
