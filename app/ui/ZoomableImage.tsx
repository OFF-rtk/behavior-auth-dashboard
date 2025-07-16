'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ZoomableImage(props: ImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <div
        className="cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <Image {...props} />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // prevent modal close on image click
          >
            <button
              className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-md"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5 text-black" />
            </button>
            <Image {...props} className="max-h-[80vh] w-auto" />
          </div>
        </div>
      )}
    </>
  );
}
