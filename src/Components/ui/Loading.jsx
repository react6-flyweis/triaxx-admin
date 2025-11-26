const Loading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="flex flex-col items-center gap-3 px-6 py-4 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
      <svg
        className="animate-spin h-10 w-10 text-purple-700"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <div className="text-sm text-gray-800">Loading...</div>
    </div>
  </div>
);

export default Loading;
