import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50 animate-fade-in">
      <div className="flex flex-col items-center animate-slide-in-up">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-pulse"></div>
        </div>
        <p className="mt-4 text-primary-800 font-medium animate-fade-in-delay">Loading...</p>
        <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;