import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const ContentSelector = ({ currentPath, setCurrentPath }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef(null);

  const contentItems = [
    { path: "/akkan", label: "Akkan" },
    { path: "/argos", label: "Argos" },
    { path: "/brelshaza", label: "Brelshaza" },
    { path: "/clown", label: "Clown" },
    { path: "/kayangel", label: "Kayangel" },
    { path: "/oreha", label: "Oreha" },
    { path: "/thaemine", label: "Thaemine" },
    { path: "/valtan", label: "Valtan" },
    { path: "/voldis", label: "Voldis" },
    { path: "/vykas", label: "Vykas" }
  ];

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth === scrollWidth);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check

    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-4" ref={scrollContainerRef}>
        {contentItems.map((item, index) => (
          <div key={index} className="snap-start shrink-0">
            <Link href={item.path} passHref>
              <a onClick={(e) => {
                e.preventDefault();
                setCurrentPath(item.path);
              }} className={clsx(
                "block p-2 rounded-lg transition duration-300 ease-in-out transform",
                currentPath === item.path ? 'bg-primary-background-selection-color scale-105' : 'bg-chip-background-color',
                "hover:bg-primary-background-hover-color"
              )}>
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2">
                  {/* Placeholder for images */}
                  <span>{item.label}</span> {/* Temporary placeholder */}
                </div>
                <span className="text-center block text-sm font-bold text-chip-text-color">{item.label}</span>
              </a>
            </Link>
          </div>
        ))}
      </div>
      { !isAtStart && (
        <button 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black p-2"
          onClick={() => scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
      { !isAtEnd && (
        <button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black p-2"
          onClick={() => scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
    </div>
  );
};

export default ContentSelector;
