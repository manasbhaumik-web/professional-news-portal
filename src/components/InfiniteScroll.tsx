import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onIntersect: () => void;
  hasMore: boolean;
  loading?: boolean;
}

export default function InfiniteScroll({ onIntersect, hasMore, loading = false }: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onIntersect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } 
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onIntersect, hasMore, loading]);

  if (!hasMore) return null;

  return (
    <div ref={observerTarget} className="flex justify-center p-8 col-span-full w-full">
      {loading ? (
        <div className="w-6 h-6 border-2 border-portal-accent border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="h-6" /> 
      )}
    </div>
  );
}
