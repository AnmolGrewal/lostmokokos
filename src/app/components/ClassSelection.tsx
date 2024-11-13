import React, { useState } from 'react';
import Image from 'next/image';
import { classData } from '@/data/classData';

interface ClassItem {
  name: string;
  role: 'Damage' | 'Support';
  bgSrc?: string;
}

interface ClassCardProps {
  classItem: ClassItem;
  onToggleFavorite: (classItem: ClassItem) => void;
  isFavorited: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, onToggleFavorite, isFavorited }) => {
  return (
    <div className="group relative flex flex-row">
      <div className="absolute bottom-0 right-3 z-50 hidden overflow-hidden rounded-t-md border-l border-r border-t border-slate-50/5 bg-chip-background-color opacity-0 transition-all focus-visible:opacity-100 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex">
        <button
          onClick={() => onToggleFavorite(classItem)}
          className="px-2 py-1 transition-all hover:text-primary-text-red-color"
          title={`Add ${classItem.name} to favorites`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
  
      <div
        tabIndex={0}
        className="class-button relative flex min-h-[8rem] w-full cursor-pointer justify-start overflow-hidden rounded-xl border border-white/10 bg-secondary-background-color bg-contain bg-[96%] bg-no-repeat px-6 py-4 no-underline bg-blend-soft-light transition-all"
        style={{ 
          backgroundImage: `url(${classItem.bgSrc})`,
          backgroundPosition: 'right center',
          backgroundSize: '180px'
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: `url(${classItem.bgSrc})`,
          }}
        />
  
        <svg className="absolute bottom-0 left-0 right-0 z-0 w-[100%] opacity-100 transition-all duration-200">
          <defs>
            <radialGradient id={`hover${classItem.name}`} cy="100%">
              <stop offset="0%" stopColor="var(--primary-background-selection-color)" />
              <stop offset="53.95%" stopColor="rgba(121, 66, 68, 0.12)" />
              <stop offset="100%" stopColor="var(--primary-background-color)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hover${classItem.name})`} />
        </svg>
  
        <div className="relative z-10">
          <div className="text-left text-xl font-bold text-primary-text-label-color transition-all group-hover:text-primary-text-color">
            {classItem.name}
          </div>
          <div className="text-left text-primary-text-label-color">Class Guide</div>
        </div>
  
        <Image
          alt="classImage"
          src={classItem.bgSrc || ''}
          width={140}
          height={140}
          className="mr-4 transition-all"
        />


  
        <div className="absolute bottom-0 left-4 z-20">
          <span className="mr-1 rounded-t-md border-l border-r border-t border-slate-50/5 bg-chip-background-color px-2 py-1 text-xs font-semibold uppercase text-primary-text-label-color">
            {classItem.role.toLowerCase()}
          </span>
        </div>
      </div>
  
      <div className="flex flex-col items-center justify-center md:hidden">
        <button
          onClick={() => onToggleFavorite(classItem)}
          className="px-2 py-1 transition-all"
          title={`Add ${classItem.name} to favorites`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary-text-red-color">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const ClassSelection: React.FC = () => {
  const [favorites, setFavorites] = useState<ClassItem[]>([]);

  const toggleFavorite = (classItem: ClassItem) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.find((fav) => fav.name === classItem.name);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.name !== classItem.name);
      } else {
        return [...prevFavorites, classItem];
      }
    });
  };

  const renderClassSection = (sectionName: string, classes: ClassItem[]) => (
    <div key={sectionName} className="w-full mb-8">
      <h3 className="mb-4 text-2xl font-bold text-primary-text-label-color">{sectionName}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.name}
            classItem={classItem}
            onToggleFavorite={toggleFavorite}
            isFavorited={favorites.some((fav) => fav.name === classItem.name)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full bg-primary-background-color p-4 md:p-6">
      <h2 className="mb-6 text-3xl font-bold text-primary-text-label-color">Favorites</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full mb-8">
        {favorites.length > 0 ? (
          favorites.map((classItem) => (
            <ClassCard
              key={classItem.name}
              classItem={classItem}
              onToggleFavorite={toggleFavorite}
              isFavorited={true}
            />
          ))
        ) : (
          <p className="text-primary-text-label-color">No favorites selected.</p>
        )}
      </div>

      {Object.entries(classData).map(([sectionName, classes]) =>
        renderClassSection(sectionName, classes)
      )}
    </div>
  );
};

export default ClassSelection;