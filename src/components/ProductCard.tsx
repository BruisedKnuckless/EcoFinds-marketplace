import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/store/marketplace';
import { useMarketplaceStore } from '@/store/marketplace';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart, isAuthenticated } = useMarketplaceStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to login to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    addToCart(product.id);
    toast({
      title: "Added to Cart",
      description: `₹{product.title} has been added to your cart.`,
    });
  };

  return (
    <Card 
      className="hover-lift cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
            {product.title}
          </h3>
          {product.featured && (
            <Badge variant="secondary" className="shrink-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              ₹{product.price}
            </p>
            <p className="text-xs text-muted-foreground">
              by {product.sellerName}
            </p>
          </div>
          
          <Badge variant="outline">
            {product.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          variant="marketplace"
          size="sm"
          className="w-full"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}