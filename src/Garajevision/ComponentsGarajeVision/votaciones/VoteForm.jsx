import React from "react";
import PointsTable from "./PointsTable";
import VideoCarousel from "./VideoCarousel";
import VoteButton from "./VoteButton";
import { Link } from "react-router-dom";

const VoteForm = ({
  edition,
  votacion,
  videos,
  assignments,
  handleSelect,
  handleSubmit,
  error,
  success,
  carouselIndex,
  goToPrev,
  goToNext,
  showVideo,
  setShowVideo,
  PLACEHOLDER_POSTER,
  user,
  loading,
}) => (
  <>
    <div className="w-full flex justify-center mb-2">
      <Link
        to="/GarajeVision"
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm shadow-md border border-white/20 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 text-white hover:from-violet-600 hover:to-cyan-500 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300 z-20"
        style={{ boxShadow: "0 2px 8px 0 rgba(139, 92, 246, 0.15)" }}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
          />
        </svg>
        Home
      </Link>
    </div>
    <VideoCarousel
      videos={videos}
      carouselIndex={carouselIndex}
      goToPrev={goToPrev}
      goToNext={goToNext}
      showVideo={showVideo}
      setShowVideo={setShowVideo}
      PLACEHOLDER_POSTER={PLACEHOLDER_POSTER}
    />
    <form onSubmit={handleSubmit} className="overflow-x-visible relative">
      <PointsTable
        POINTS={[12, 10, 8, 7, 6, 5, 4, 3, 2, 1]}
        videos={videos}
        assignments={assignments}
        handleSelect={handleSelect}
        user={user}
      />
      {error && <div className="text-red-400 mb-2 text-center">{error}</div>}
      {success && (
        <div className="text-green-400 mb-2 text-center">{success}</div>
      )}
      <div className="flex justify-center mt-4">
        <VoteButton loading={loading} disabled={false} />
      </div>
    </form>
  </>
);

export default VoteForm;
