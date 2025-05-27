"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function BackgroundImage({ children }: { children: React.ReactNode }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative min-h-screen">

      {!imageError && (
        <Image
          src="/image/background-image.jpg"
          alt="Fondo de tráfico"
          fill
          className={`object-cover transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          priority
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-gray-50/85 to-gray-100/90 z-10"></div>
      
      <div className="relative z-20">
        {children}
      </div>

      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      )}
    </div>
  );
}