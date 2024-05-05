import React from 'react';
import Link from 'next/link';

interface DynamicContentProps {
  currentPath: string;
}

const raidItems = [
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

const DynamicContent: React.FC<DynamicContentProps> = ({ currentPath }) => {
  return (
    <div>
      {raidItems.map((item) => (
        <Link key={item.label} href={item.path}>
          <a className={`p-4 block text-center ${currentPath === item.path ? 'text-blue-500' : 'text-gray-500'}`}>
            {item.label}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default DynamicContent;
