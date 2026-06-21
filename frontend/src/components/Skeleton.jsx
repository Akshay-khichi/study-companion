export const CardSkeleton = () => (
  <div className="bg-elevated border border-border rounded-xl p-5 h-[160px] animate-pulse">
    <div className="flex space-x-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-border"></div>
      <div className="w-12 h-4 rounded-full bg-border mt-1"></div>
    </div>
    <div className="h-4 bg-border rounded-full w-3/4 mb-2"></div>
    <div className="h-3 bg-border rounded-full w-1/2 mt-4"></div>
  </div>
);

export const ContentSkeleton = ({ lines = 5 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-elevated rounded-full" style={{ width: `${100 - (i * 5)}%` }}></div>
    ))}
  </div>
);