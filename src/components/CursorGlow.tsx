import React, { useState, useEffect } from 'react';

const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-50 mix-blend-screen"
      style={{
        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(0, 229, 255, 0.15), transparent 40%)`
      }}
    />
  );
};

export default CursorGlow;
