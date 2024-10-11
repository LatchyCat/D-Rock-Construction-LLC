import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/D_Rock_Logo.jpg" alt="D-Rock Construction Logo" className="h-12 w-auto mr-4" />
          <h1 className="text-2xl font-bold">D-Rock Construction</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/services" className="hover:text-gray-300">Services</Link></li>
            <li><Link to="/reviews" className="hover:text-gray-300">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
          </ul>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-700">
          <ul className="flex flex-col items-center py-4">
            <li className="py-2"><Link to="/" className="hover:text-gray-300" onClick={toggleMenu}>Home</Link></li>
            <li className="py-2"><Link to="/services" className="hover:text-gray-300" onClick={toggleMenu}>Services</Link></li>
            <li className="py-2"><Link to="/reviews" className="hover:text-gray-300" onClick={toggleMenu}>Reviews</Link></li>
            <li className="py-2"><Link to="/contact" className="hover:text-gray-300" onClick={toggleMenu}>Contact</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
