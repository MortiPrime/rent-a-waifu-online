import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const CatalogCardSkeleton = () => (
  <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none bg-white/10" />
    <CardHeader className="pb-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/10" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-20 bg-white/10" />
      <Skeleton className="h-4 w-full bg-white/10" />
      <Skeleton className="h-4 w-3/4 bg-white/10" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1 bg-white/10" />
        <Skeleton className="h-9 flex-1 bg-white/10" />
      </div>
    </CardContent>
  </Card>
);

export const CatalogSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <CatalogCardSkeleton key={i} />
    ))}
  </div>
);

export default CatalogCardSkeleton;
