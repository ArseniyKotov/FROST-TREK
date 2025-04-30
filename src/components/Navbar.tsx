import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="glass-card mb-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="neon-text-pink text-2xl font-bold">FROST TREK</Link>
        <div className="flex space-x-4">
          <Link to="/" className="neon-text-blue hover:neon-text-purple transition-all">Home</Link>
          <Link to="/resorts" className="neon-text-blue hover:neon-text-purple transition-all">Resorts</Link>
          <Link to="/trips" className="neon-text-blue hover:neon-text-purple transition-all">My Trips</Link>
          <Link to="/profile" className="neon-text-blue hover:neon-text-purple transition-all">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
