/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import raidsInfo, { Raid } from '../../data/raidsInfo';
import clsx from 'clsx';

const ContentSelector = ({ currentPath }: { currentPath: string }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const contentItems: Raid[] = raidsInfo.filter((raid) => !raid.path.endsWith('-hard'));

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const adjustedPath = currentPath.endsWith('-hard') ? currentPath.replace('-hard', '') : currentPath;
      const selectedItem = container.querySelector(`a[href='${adjustedPath}']`) as HTMLAnchorElement;
      if (selectedItem) {
        container.scrollTo({
          left: selectedItem.offsetLeft - container.offsetWidth / 2 + selectedItem.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentPath]);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);

      // Define event type and prevent default behavior
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        container.scrollLeft += (e.deltaY + e.deltaX * 0.25) * 4; // Increase scroll speed by multiplying by 4
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
    }
  }, []);

  return (
    <div className="relative size-full bg-primary-background-color">
      <div className="flex flex-shrink-0 overflow-x-auto scroll-smooth p-4 pl-8 justify-evenly" ref={scrollContainerRef}>
        {contentItems.map((item, index) => (
          <Link key={index} href={item.path} className={clsx('block p-2 rounded-lg transition duration-300 ease-in-out transform shrink-0', currentPath === item.path || currentPath === `${item.path}-hard` ? 'bg-primary-background-selection-color scale-105' : 'bg-chip-background-color', currentPath !== item.path && currentPath !== `${item.path}-hard` && 'hover:bg-primary-background-hover-color hover:scale-105', index !== 0 && 'ml-4')}>
            <img
              src={item.imgSrc}
              alt={item.label}
              className="w-24 h-24 md:w-32 md:h-32 mb-2"
              style={{
                objectFit: 'cover',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            <span className="text-center block text-sm font-bold text-chip-text-color">{item.label}</span>
          </Link>
        ))}
      </div>
      {!isAtStart && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black p-2"
          onClick={() =>
            scrollContainerRef.current?.scrollBy({
              left: -300,
              behavior: 'smooth',
            })
          }
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
      {!isAtEnd && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black p-2"
          onClick={() =>
            scrollContainerRef.current?.scrollBy({
              left: 300,
              behavior: 'smooth',
            })
          }
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
    </div>
  );
};

export default ContentSelector;
