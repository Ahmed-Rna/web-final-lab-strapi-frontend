'use client'
import React, { useState, useRef, useEffect } from 'react'

export default function Slider({ categories = [] }) {
  const [activeCategory, setActiveCategory] = useState('');
  const scrollContainerRef = useRef(null);
  const categoryRef = useRef(null);
  const [dynamicScrollAmount, setDynamicScrollAmount] = useState(200);

  useEffect(() => {
    if (categoryRef.current) {
      const width = categoryRef.current.offsetWidth;
      setDynamicScrollAmount(width);
    }
  }, [categories]);

  useEffect(() => {
    // Set the first category as active when categories are loaded
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].Name);
    }
  }, [categories, activeCategory]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -dynamicScrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: dynamicScrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category.Name);
    
    // Scroll to the category section
    const element = document.getElementById(`category-${category.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-[64px] bg-white z-40 shadow-sm"> {/* Adjust top value based on your navbar height */}
      <div className="relative w-full max-w-full md:max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-10 overflow-hidden">
        <div className="flex items-center justify-center">
          <button
            onClick={handleScrollLeft}
            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Scroll left"
          >
            &lt;
          </button>
          
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((category, index) => (
              <button
                key={category.id}
                ref={index === 0 ? categoryRef : null}
                onClick={() => handleCategoryClick(category)}
                className={`inline-block px-4 py-2 text-xs sm:text-sm md:text-base lg:text-md font-semibold ${
                  activeCategory === category.Name 
                    ? 'text-red-500 border-b-2 border-red-500' 
                    : 'text-gray-800'
                } transition-colors duration-200 focus:outline-none`}
              >
                {category.Name}
              </button>
            ))}
          </div>

          <button
            onClick={handleScrollRight}
            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Scroll right"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
