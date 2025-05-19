import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Ulster Banking Application
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome to Ulster Banking! This page is successfully deployed on GitHub Pages.
        </p>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Deployment Status: Active</span>
        </div>
      </div>
    </div>
  );
}

export default App;