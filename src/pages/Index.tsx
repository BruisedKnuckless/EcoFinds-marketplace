import { useEffect } from 'react';
import { Smartphone, Shirt, Home, BookOpen, Package, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { ChatWidget } from '@/components/ChatWidget';
import { useMarketplaceStore } from '@/store/marketplace';
import heroImage from '@/assets/hero-marketplace.jpg';

const categories = [
  { name: 'Electronics', icon: Smartphone, count: 150 },
  { name: 'Fashion', icon: Shirt, count: 89 },
  { name: 'Home', icon: Home, count: 124 },
  { name: 'Books', icon: BookOpen, count: 67 },
  { name: 'Other', icon: Package, count: 203 }
];

const Index = () => {
  const { products, featuredProducts, isDarkMode } = useMarketplaceStore();

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Marketplace Hero"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Your premier destination for electronics, fashion, home goods, and more. 
              Join thousands of buyers and sellers in our thriving marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="hover-glow">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:text-white">
                Sell Your Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of products across multiple categories. 
              Find exactly what you're looking for with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                count={category.count}
                onClick={() => console.log(`Navigate to ${category.name}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Star className="mr-3 h-8 w-8 text-primary" />
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Hand-picked products that our community loves most
              </p>
            </div>
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => console.log(`Navigate to product ${product.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <TrendingUp className="mr-3 h-8 w-8 text-primary" />
                Latest Arrivals
              </h2>
              <p className="text-muted-foreground">
                Fresh products from our newest sellers
              </p>
            </div>
            <Button variant="outline">
              See More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => console.log(`Navigate to product ${product.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-secondary-foreground mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-secondary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join our community of sellers and start earning today. It's free to list your products!
          </p>
          <Button variant="outline" size="lg" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Index;
