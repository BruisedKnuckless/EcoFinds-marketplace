import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Purchase {
  id: string;
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
  purchaseDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  message: string;
  timestamp: string;
}

interface MarketplaceState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Products
  products: Product[];
  featuredProducts: Product[];
  
  // Cart
  cart: CartItem[];
  
  // Purchases
  purchases: Purchase[];
  
  // Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  
  // UI
  isDarkMode: boolean;
  
  // Actions
  login: (email: string, password: string, username: string) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'purchaseDate'>) => void;
  addChatMessage: (message: string, sender?: 'user' | 'support') => void;
  toggleChat: () => void;
  toggleDarkMode: () => void;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Headphones Pro',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 299.99,
    category: 'Electronics',
    image: '/placeholder.svg',
    sellerId: 'seller1',
    sellerName: 'TechStore',
    createdAt: '2024-01-15',
    featured: true
  },
  {
    id: '2',
    title: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    category: 'Electronics',
    image: '/placeholder.svg',
    sellerId: 'seller2',
    sellerName: 'FitGear',
    createdAt: '2024-01-14',
    featured: true
  },
  {
    id: '3',
    title: 'Designer Leather Jacket',
    description: 'Premium genuine leather jacket with modern styling and perfect fit.',
    price: 249.99,
    category: 'Fashion',
    image: '/placeholder.svg',
    sellerId: 'seller3',
    sellerName: 'StyleCo',
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Modern Coffee Table',
    description: 'Sleek modern coffee table perfect for contemporary living spaces.',
    price: 399.99,
    category: 'Home',
    image: '/placeholder.svg',
    sellerId: 'seller4',
    sellerName: 'HomeDesign',
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    title: 'Programming Fundamentals',
    description: 'Comprehensive guide to learning programming from basics to advanced concepts.',
    price: 49.99,
    category: 'Books',
    image: '/placeholder.svg',
    sellerId: 'seller5',
    sellerName: 'EduBooks',
    createdAt: '2024-01-11'
  }
];

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      products: mockProducts,
      featuredProducts: mockProducts.filter(p => p.featured),
      cart: [],
      purchases: [],
      chatMessages: [
        {
          id: '1',
          sender: 'support',
          message: 'Welcome to Lovable Marketplace! How can I help you today?',
          timestamp: new Date().toISOString()
        }
      ],
      isChatOpen: false,
      isDarkMode: false,

      // Actions
      login: (email, password, username) => {
        const user: User = {
          id: Date.now().toString(),
          email,
          username,
          createdAt: new Date().toISOString()
        };
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      addProduct: (productData) => {
        const { user } = get();
        if (!user) return;

        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          sellerId: user.id,
          sellerName: user.username,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          products: [newProduct, ...state.products]
        }));
      },

      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },

      deleteProduct: (id) => {
        const { user } = get();
        if (!user) return;

        set(state => ({
          products: state.products.filter(p => 
            p.id !== id || p.sellerId === user.id
          )
        }));
      },

      addToCart: (productId, quantity = 1) => {
        set(state => {
          const existingItem = state.cart.find(item => item.productId === productId);
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            cart: [...state.cart, { productId, quantity }]
          };
        });
      },

      removeFromCart: (productId) => {
        set(state => ({
          cart: state.cart.filter(item => item.productId !== productId)
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addPurchase: (purchaseData) => {
        const purchase: Purchase = {
          ...purchaseData,
          id: Date.now().toString(),
          purchaseDate: new Date().toISOString()
        };
        set(state => ({
          purchases: [purchase, ...state.purchases]
        }));
      },

      addChatMessage: (message, sender = 'user') => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender,
          message,
          timestamp: new Date().toISOString()
        };
        
        set(state => ({
          chatMessages: [...state.chatMessages, newMessage]
        }));

        // Auto-reply simulation
        if (sender === 'user') {
          setTimeout(() => {
            const botReply = getBotReply(message);
            if (botReply) {
              const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot' as const,
                message: botReply,
                timestamp: new Date().toISOString()
              };
              set(state => ({
                chatMessages: [...state.chatMessages, botMessage]
              }));
            }
          }, 1000);
        }
      },

      toggleChat: () => {
        set(state => ({ isChatOpen: !state.isChatOpen }));
      },

      toggleDarkMode: () => {
        set(state => ({ isDarkMode: !state.isDarkMode }));
      }
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        purchases: state.purchases,
        isDarkMode: state.isDarkMode
      })
    }
  )
);

// Bot reply logic
function getBotReply(message: string): string | null {
  const msg = message.toLowerCase();
  
  if (msg.includes('sell') || msg.includes('listing') || msg.includes('product')) {
    return "To sell products on our marketplace, simply click 'Sell' in the navigation and fill out the product form. We support Electronics, Fashion, Home, Books, and Other categories.";
  }
  
  if (msg.includes('price') || msg.includes('pricing')) {
    return "You can set your own prices for products. We recommend researching similar items to price competitively. There are no listing fees!";
  }
  
  if (msg.includes('category') || msg.includes('categories')) {
    return "We have 5 main categories: Electronics, Fashion, Home, Books, and Other. Choose the category that best fits your product.";
  }
  
  if (msg.includes('help') || msg.includes('how')) {
    return "I can help with selling questions! Ask me about listing products, pricing, categories, or general marketplace policies.";
  }
  
  return "Thanks for your message! I specialize in helping with selling and product-related questions. How can I assist you with your marketplace experience?";
}