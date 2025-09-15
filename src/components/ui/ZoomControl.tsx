import React from 'react';

interface ZoomControlProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControl: React.FC<ZoomControlProps> = ({ zoomLevel, onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="zoom-control fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-center"
        title="Zoom In"
        disabled={zoomLevel >= 2}
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      
      <div className="px-2 py-1 text-xs text-gray-500 text-center border-t border-b border-gray-100">
        {Math.round(zoomLevel * 100)}%
      </div>
      
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-center"
        title="Zoom Out"
        disabled={zoomLevel <= 0.5}
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>
      
      <button
        onClick={onReset}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-center"
        title="Reset Zoom"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};

export default ZoomControl;
