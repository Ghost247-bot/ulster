import React, { useState } from 'react';
import HeroSection from '../components/layouts/HeroSection';
import HomeBody from '../components/layouts/HomeBody';
import ZoomControl from '../components/ui/ZoomControl';

const Home: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  return (
    <div 
      className="zoom-container"
      style={{ 
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      <HeroSection />
      <HomeBody />
      <ZoomControl 
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
};

export default Home; 