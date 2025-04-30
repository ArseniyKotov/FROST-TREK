import React from 'react';
import { Resort } from '../api/types';
import { Link } from 'react-router-dom';

interface ResortCardProps {
  resort: Resort;
}

const getDifficultyColor = (difficulty: string | undefined) => {
  switch (difficulty) {
    case 'BEGINNER': return 'neon-text-green';
    case 'INTERMEDIATE': return 'neon-text-blue';
    case 'ADVANCED': return 'neon-text-purple';
    case 'EXPERT': return 'neon-text-pink';
    default: return 'text-white';
  }
};

const ResortCard: React.FC<ResortCardProps> = ({ resort }) => {
  return (
    <div className="glass-card neon-border-blue hover:neon-border-purple transition-all duration-300 transform hover:scale-105">
      <div className="relative h-48 mb-4 overflow-hidden rounded">
        <img 
          src={resort.imageUrl || `https://source.unsplash.com/random/800x600/?ski,resort,snow,mountain&${resort.id}`} 
          alt={resort.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <h3 className="neon-text-blue text-xl font-bold">{resort.name}</h3>
          <p className="text-white text-sm">{resort.location}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className={`font-bold ${getDifficultyColor(resort.difficulty)}`}>
            {resort.difficulty || 'UNKNOWN'}
          </p>
          <p className="text-sm text-gray-300">
            {resort.numberOfTrails} Trails | {resort.elevation}m
          </p>
        </div>
        <Link to={`/resorts/${resort.id}`} className="neon-button-blue">
          Details
        </Link>
      </div>
    </div>
  );
};

export default ResortCard;
