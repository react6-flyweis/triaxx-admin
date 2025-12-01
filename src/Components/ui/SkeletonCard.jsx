const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/5 mb-3 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center" />
    </div>
  </div>
);

export default SkeletonCard;
