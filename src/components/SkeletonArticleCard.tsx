import React from 'react';

export default React.memo(function SkeletonArticleCard({ index }: { key?: React.Key | string | number; index?: number }) {
  let bentoClass = 'flex-col sm:flex-row';
  let imageClass = 'w-full sm:w-36 h-28 rounded-lg';
  let isHero = false;
  let isCompact = false;

  if (index !== undefined) {
    if (index % 5 === 0) {
      bentoClass = 'md:col-span-2 row-span-2 flex-col sm:flex-row items-stretch';
      imageClass = 'w-full sm:w-1/2 min-h-[200px] rounded-2xl';
      isHero = true;
    } else if (index % 5 === 3 || index % 5 === 4) {
      bentoClass = 'col-span-1 row-span-1 flex-col sm:flex-row items-start sm:items-center';
      imageClass = 'hidden sm:block w-20 h-20 rounded-xl';
      isCompact = true;
    } else {
      bentoClass = 'col-span-1 row-span-2 flex-col';
      imageClass = 'w-full h-48 rounded-2xl';
    }
  }

  return (
    <div className={`p-5 rounded-3xl space-y-3 animate-pulse bg-portal-surface border border-portal-border shadow-sm flex gap-5 ${bentoClass}`}>
      <div className={`shrink-0 bg-portal-bg border border-portal-border/50 ${imageClass}`} />
      <div className="flex-1 space-y-4 py-1">
        <div className="flex justify-between">
          <div className="h-3 rounded w-1/4 bg-portal-bg" />
          <div className="h-3 rounded w-1/6 bg-portal-bg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 rounded w-3/4 bg-portal-bg" />
          <div className="h-4 rounded w-1/2 bg-portal-bg" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-2.5 rounded w-full bg-portal-bg" />
          <div className="h-2.5 rounded w-5/6 bg-portal-bg" />
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-2.5 rounded w-1/4 bg-portal-bg" />
          <div className="h-3 rounded w-1/5 bg-portal-bg" />
        </div>
      </div>
    </div>
  );
});
