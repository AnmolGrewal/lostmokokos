import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDungeon } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';

interface NavigationBarProps {
  currentPath: string;
}

const NavigationBar = ({ currentPath }: NavigationBarProps) => {
  const navItems = [
    { path: "/", label: "Home", icon: faHome },
    { path: "/raids", label: "Raids", icon: faDungeon }
  ];

  const router = useRouter();

  const isActive = (path: string) => {
    return path === "/" ? currentPath === path : currentPath.startsWith(path);
  };

  return (
    <div className="bg-secondary-background-color w-full h-14 flex justify-center items-center">
      <div className="flex gap-4 items-center">
        {navItems.map(item => (
          <Link
            href={item.path}
            key={item.label}
            passHref
          >
            <a
              className={clsx(
                "flex items-center px-3 py-1 rounded-full transition-all duration-300 ease-in-out",
                isActive(item.path) ? 'bg-primary-background-selection-color cursor-not-allowed' : 'bg-chip-background-color',
                !isActive(item.path) && "hover:bg-primary-background-hover-color hover:scale-105 cursor-pointer"
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
              <span className="ml-2 text-lg text-chip-text-color font-bold">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;
