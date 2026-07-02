import Skeleton from '../common/Skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
