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

  useEffect(() => {
    const container = scrollContainerRef.current;
    const checkScrollPosition = () => {
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check

    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-center space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-4" ref={scrollContainerRef}>
        {contentItems.map((item, index) => (
          <Link key={index} href={item.path} passHref>
            <a className={clsx(
              "block p-2 rounded-lg transition duration-300 ease-in-out transform snap-center shrink-0",
              currentPath === item.path ? 'bg-primary-background-selection-color scale-105' : 'bg-chip-background-color',
              "hover:bg-primary-background-hover-color"
            )}>
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center mb-2">{item.label}</div>
              <span className="text-center block text-sm font-bold text-chip-text-color">{item.label}</span>
            </a>
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
