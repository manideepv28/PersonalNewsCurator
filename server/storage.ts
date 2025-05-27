import { users, articles, savedArticles, type User, type InsertUser, type Article, type InsertArticle, type SavedArticle, type InsertSavedArticle } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Article operations
  getAllArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Saved articles operations
  getSavedArticles(userId: number): Promise<Article[]>;
  saveArticle(savedArticle: InsertSavedArticle): Promise<SavedArticle>;
  unsaveArticle(userId: number, articleId: number): Promise<boolean>;
  isArticleSaved(userId: number, articleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private savedArticles: Map<number, SavedArticle>;
  private currentUserId: number;
  private currentArticleId: number;
  private currentSavedId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.savedArticles = new Map();
    this.currentUserId = 1;
    this.currentArticleId = 1;
    this.currentSavedId = 1;
    
    // Initialize with mock articles
    this.initializeArticles();
  }

  private initializeArticles() {
    const mockArticles: InsertArticle[] = [
      {
        title: "Revolutionary AI Technology Transforms Urban Planning in Smart Cities",
        description: "A groundbreaking artificial intelligence system is now being deployed across major metropolitan areas to optimize traffic flow, reduce energy consumption, and improve urban living conditions for millions of residents.",
        content: "Full article content...",
        category: "technology",
        source: "TechCrunch",
        author: "Sarah Johnson",
        publishedAt: "2 hours ago",
        url: "https://example.com/article1",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400",
      },
      {
        title: "Remote Work Trends Continue to Shape Corporate Policies",
        description: "Companies worldwide are adapting their policies to accommodate the growing demand for flexible work arrangements, with hybrid models becoming the new standard.",
        content: "Full article content...",
        category: "business",
        source: "Forbes",
        author: "Michael Chen",
        publishedAt: "4 hours ago",
        url: "https://example.com/article2",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      },
      {
        title: "Championship Finals Draw Record Breaking Viewership",
        description: "The highly anticipated championship game attracted over 50 million viewers worldwide, setting new records for digital streaming platforms.",
        content: "Full article content...",
        category: "sports",
        source: "ESPN",
        author: "David Martinez",
        publishedAt: "6 hours ago",
        url: "https://example.com/article3",
        imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      },
      {
        title: "Breakthrough Treatment Shows Promise for Rare Diseases",
        description: "Clinical trials reveal significant improvements in patient outcomes using innovative gene therapy techniques developed by international research teams.",
        content: "Full article content...",
        category: "health",
        source: "Medical News",
        author: "Dr. Emily Rodriguez",
        publishedAt: "8 hours ago",
        url: "https://example.com/article4",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      },
      {
        title: "New Environmental Policy Gains Bipartisan Support",
        description: "Lawmakers from both parties unite behind comprehensive climate legislation aimed at reducing carbon emissions and promoting renewable energy initiatives.",
        content: "Full article content...",
        category: "politics",
        source: "Reuters",
        author: "Alex Thompson",
        publishedAt: "1 day ago",
        url: "https://example.com/article5",
        imageUrl: "https://images.unsplash.com/photo-1555581234-0af19e9c2c12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      },
      {
        title: "Streaming Wars Heat Up with New Platform Launches",
        description: "The entertainment industry sees increased competition as multiple new streaming services enter the market with exclusive content and innovative features.",
        content: "Full article content...",
        category: "entertainment",
        source: "Variety",
        author: "Jessica Park",
        publishedAt: "1 day ago",
        url: "https://example.com/article6",
        imageUrl: "https://images.unsplash.com/photo-1489599663928-f2be171c491a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      },
    ];

    mockArticles.forEach(article => {
      this.createArticle(article);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      preferences: insertUser.preferences ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => {
      // Sort by published date (newer first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    const allArticles = await this.getAllArticles();
    return allArticles.filter(article => article.category === category);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const allArticles = await this.getAllArticles();
    const searchLower = query.toLowerCase();
    return allArticles.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.description.toLowerCase().includes(searchLower) ||
      article.source.toLowerCase().includes(searchLower)
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { 
      ...insertArticle, 
      id,
      content: insertArticle.content ?? null,
      author: insertArticle.author ?? null,
      imageUrl: insertArticle.imageUrl ?? null
    };
    this.articles.set(id, article);
    return article;
  }

  async getSavedArticles(userId: number): Promise<Article[]> {
    const userSavedArticles = Array.from(this.savedArticles.values())
      .filter(saved => saved.userId === userId);
    
    const articles: Article[] = [];
    for (const saved of userSavedArticles) {
      const article = this.articles.get(saved.articleId);
      if (article) {
        articles.push(article);
      }
    }
    
    return articles;
  }

  async saveArticle(savedArticle: InsertSavedArticle): Promise<SavedArticle> {
    const id = this.currentSavedId++;
    const saved: SavedArticle = { ...savedArticle, id };
    this.savedArticles.set(id, saved);
    return saved;
  }

  async unsaveArticle(userId: number, articleId: number): Promise<boolean> {
    const saved = Array.from(this.savedArticles.entries())
      .find(([, s]) => s.userId === userId && s.articleId === articleId);
    
    if (saved) {
      this.savedArticles.delete(saved[0]);
      return true;
    }
    
    return false;
  }

  async isArticleSaved(userId: number, articleId: number): Promise<boolean> {
    return Array.from(this.savedArticles.values())
      .some(saved => saved.userId === userId && saved.articleId === articleId);
  }
}

export const storage = new MemStorage();
