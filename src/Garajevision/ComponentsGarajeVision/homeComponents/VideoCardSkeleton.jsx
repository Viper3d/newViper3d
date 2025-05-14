import React from "react";

const VideoCardSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-700 to-black rounded-xl p-4 flex flex-col items-center space-y-3 shadow-md animate-pulse">
      {/* Skeleton for badge */}
      <div className="absolute top-2 right-2 bg-gray-600 rounded-full px-2 h-5 w-10"></div>

      {/* Skeleton for video */}
      <div className="w-full h-48 bg-gray-600 rounded-md"></div>

      {/* Skeleton for title */}
      <div className="h-6 bg-gray-600 rounded w-3/4"></div>

      {/* Skeleton for authors */}
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>

      {/* Skeleton for rating */}
      <div className="absolute bottom-2 right-2 bg-gray-600 rounded-full px-2 h-5 w-8"></div>
    </div>
  );
};

export default VideoCardSkeleton;
