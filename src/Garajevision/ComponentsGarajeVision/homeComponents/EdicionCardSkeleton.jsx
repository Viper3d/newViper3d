import React from "react";
import VideoCardSkeleton from "./VideoCardSkeleton";

const EdicionCardSkeleton = () => {
  return (
    <div className="bg-violet-900 bg-opacity-90 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="p-4">
        {/* Skeleton for EdicionCard title */}
        <div className="h-8 bg-gray-600 rounded w-1/2 mb-4"></div>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Render 3 VideoCardSkeletons by default */}
        {[...Array(3)].map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
      <div className="p-4 text-center">
        {/* Skeleton for 'Ver todas las canciones' button */}
        <div className="h-10 bg-gray-600 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
};

export default EdicionCardSkeleton;
