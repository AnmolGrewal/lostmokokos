import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDungeon } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

interface NavigationBarProps {
  currentPath: string;
}

const NavigationBar = ({ currentPath }: NavigationBarProps) => {
  const navItems = [
    { path: "/", label: "Home", icon: faHome },
    { path: "/raids", label: "Raids", icon: faDungeon }
  ];

  return (
    <div className="bg-secondary-background-color w-full h-12 flex justify-center items-center">
      <div className="flex gap-4">
        {navItems.map(item => (
          <Link href={item.path} key={item.label} passHref>
            <a className={clsx(
              "flex items-center px-4 py-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer",
              currentPath === item.path ? 'bg-blue-500' : 'bg-[#282B2F]',
              "hover:bg-blue-600 hover:scale-105"
            )}>
              <FontAwesomeIcon icon={item.icon} className="mr-2" />
              <span className="text-primary-text-color">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;
