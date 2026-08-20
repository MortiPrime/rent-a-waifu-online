import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, children }: EmptyStateProps) => (
  <Card className="surface-card">
    <CardContent className="p-12 text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand/20 ring-1 ring-surface-border/20">
        <Icon className="h-9 w-9 text-brand" />
      </div>
      <h3 className="text-xl font-semibold text-surface-foreground mb-2">{title}</h3>
      {description && <p className="text-surface-foreground/60 mb-5">{description}</p>}
      {children}
    </CardContent>
  </Card>
);

export default EmptyState;
