import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const ContentSelector = ({ currentPath }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef(null);

  const contentItems = [
    { path: "/raids/akkan", label: "Akkan" },
    { path: "/raids/argos", label: "Argos" },
    { path: "/raids/brelshaza", label: "Brelshaza" },
    { path: "/raids/clown", label: "Clown" },
    { path: "/raids/kayangel", label: "Kayangel" },
    { path: "/raids/oreha", label: "Oreha" },
    { path: "/raids/thaemine", label: "Thaemine" },
    { path: "/raids/valtan", label: "Valtan" },
    { path: "/raids/voldis", label: "Voldis" },
    { path: "/raids/vykas", label: "Vykas" }
  ];

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', checkScrollPosition);

    // Handle mouse wheel for horizontal scrolling
    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY + (e.deltaX * 0.25); // Adjust multi-directional scrolls
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    // Handle resize
    const handleResize = () => {
      checkScrollPosition();
    };
    window.addEventListener('resize', handleResize);
    checkScrollPosition(); // Initial check

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full bg-primary-background-color">
      <div className="flex flex-shrink-0 overflow-x-auto scroll-smooth p-4 pl-8" ref={scrollContainerRef}>
        {contentItems.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={clsx(
              "block p-2 rounded-lg transition duration-300 ease-in-out transform shrink-0",
              currentPath === item.path ? 'bg-primary-background-selection-color scale-105' : 'bg-chip-background-color',
              currentPath !== item.path && "hover:bg-primary-background-hover-color hover:scale-105",
              index !== 0 && "ml-4" // Add margin to all items except the first one
            )}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 text-chip-text-color flex items-center justify-center mb-2">
              {item.label}
            </div>
            <span className="text-center block text-sm font-bold text-chip-text-color">{item.label}</span>
          </Link>
        ))}
      </div>
      {!isAtStart && (
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black p-2" onClick={() => scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
      {!isAtEnd && (
        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black p-2" onClick={() => scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
    </div>
  );
};

export default ContentSelector;
