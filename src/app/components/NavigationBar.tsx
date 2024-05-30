import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import { faHome, faDungeon, faPersonShelter, faHammer } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

interface NavigationBarProps {
  currentPath: string;
}

const NavigationBar = ({ currentPath }: NavigationBarProps) => {
  const navItems = [
    { path: '/', label: 'Home', icon: faHome },
    { path: '/raids', label: 'Raids', icon: faDungeon },
    { path: '/characters', label: 'Character Sheet', icon: faPersonShelter },
    { path: '/engravings', label: 'Engravings', icon: faHammer },
    { path: 'https://discord.gg/zFkKsrmgKg', label: 'Discord', icon: faDiscord },
  ];

  const router = useRouter();

  const isActive = (path: string) => {
    return path === '/' ? currentPath === path : currentPath.startsWith(path);
  };

  return (
    <div className="bg-secondary-background-color w-full h-14 flex justify-center items-center">
      <div className="flex gap-4 items-center">
        {navItems.slice(0, -1).map((item) => (
          <Link
            href={item.path}
            key={item.label}
            passHref
            className={clsx(
              'flex items-center px-3 py-1 rounded-full transition-all duration-300 ease-in-out',
              isActive(item.path) ? 'bg-primary-background-selection-color' : 'bg-chip-background-color',
              !isActive(item.path) && 'hover:bg-primary-background-hover-color hover:scale-105 cursor-pointer'
            )}
            onClick={(e) => {
              if (isActive(item.path)) {
                e.preventDefault(); // Prevent link navigation if item is already selected
              } else {
                router.push(item.path);
              }
            }}
          >
            <div className="text-chip-text-color bg-image-background-color rounded-full p-2">
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
            </div>
            <span className={clsx('ml-2 text-lg text-chip-text-color font-bold', 'hide-on-small')}>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center ml-4">
        <Link
          href={navItems[navItems.length - 1].path}
          key={navItems[navItems.length - 1].label}
          passHref
          className="flex items-center px-3 py-1 rounded-full transition-all duration-300 ease-in-out bg-chip-background-color hover:bg-primary-background-hover-color hover:scale-105 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-chip-text-color bg-image-background-color rounded-full p-2">
            <FontAwesomeIcon icon={navItems[navItems.length - 1].icon} className="text-xl" />
          </div>
          <span className={clsx('ml-2 text-lg text-chip-text-color font-bold', 'hide-on-small')}>
            {navItems[navItems.length - 1].label}
          </span>
        </Link>
      </div>
    </div>
  );
  
}  

export default NavigationBar;
