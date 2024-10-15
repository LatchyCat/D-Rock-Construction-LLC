import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/D_Rock_Logo.jpg" alt="D-Rock Construction Logo" className="h-12 w-auto rounded-full shadow-md" />
            <h1 className="text-2xl font-bold tracking-tight">D-Rock Construction</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {['Home', 'Services', 'Reviews', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-lg font-medium hover:text-blue-200 transition duration-150 ease-in-out"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-blue-700">
          <ul className="flex flex-col items-center py-4">
            {['Home', 'Services', 'Reviews', 'Contact'].map((item) => (
              <li key={item} className="py-2">
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-lg font-medium hover:text-blue-200 transition duration-150 ease-in-out"
                  onClick={toggleMenu}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
