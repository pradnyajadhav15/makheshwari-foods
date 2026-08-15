/**
 * Loading placeholders. These deliberately mirror the shape of the real
 * content so the layout does not jump when data lands.
 */

export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skel block ${className}`} aria-hidden="true" />;
}

export function OrderSkeleton() {
  return (
    <div className="border border-ink/12 bg-paper p-6 sm:p-8">
      <div className="flex justify-between gap-4 pb-6 mb-6 border-b border-ink/12">
        <div className="flex-1">
          <Skeleton className="h-2.5 w-16 mb-3" />
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="flex gap-2 mb-7">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-7">
        <div>
          <Skeleton className="h-2.5 w-14 mb-3" />
          <Skeleton className="h-3.5 w-full mb-2" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div>
          <Skeleton className="h-2.5 w-20 mb-3" />
          <Skeleton className="h-3.5 w-full mb-2" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="border-b border-ink/12 py-7">
      <div className="flex justify-between gap-3 mb-3">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-3.5 w-full mb-2" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  );
}
