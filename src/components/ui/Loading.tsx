import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-2 text-primary-800 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;