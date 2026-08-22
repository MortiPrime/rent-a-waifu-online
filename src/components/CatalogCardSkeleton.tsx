import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const CatalogCardSkeleton = () => (
  <Card className="surface-card overflow-hidden">
    <Skeleton className="aspect-[4/5] w-full rounded-none bg-surface/10" />
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 bg-surface/10" />
          <Skeleton className="h-4 w-24 bg-surface/10" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full bg-surface/10" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full bg-surface/10" />
      <Skeleton className="h-4 w-3/4 bg-surface/10" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1 bg-surface/10" />
        <Skeleton className="h-9 w-9 bg-surface/10" />
      </div>
    </CardContent>
  </Card>
);

export const CatalogSkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <CatalogCardSkeleton key={i} />
    ))}
  </div>
);

export default CatalogCardSkeleton;
