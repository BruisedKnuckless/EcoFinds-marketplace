import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  onClick?: () => void;
}

export function CategoryCard({ name, icon: Icon, count, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="hover-lift cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-muted mb-4 group-hover:bg-gradient-primary transition-smooth">
          <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-smooth" />
        </div>
        
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? 'item' : 'items'}
        </p>
      </CardContent>
    </Card>
  );
}