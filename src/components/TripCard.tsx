import React from 'react';
import { Trip } from '../api/types';
import { Link } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <div className="glass-card neon-border-purple hover:neon-border-green transition-all duration-300">
      <h3 className="neon-text-purple text-xl font-bold mb-2">{trip.name}</h3>
      <div className="mb-4">
        <p className="text-gray-300">
          <span className="neon-text-green">Dates:</span> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        {trip.budget && (
          <p className="text-gray-300">
            <span className="neon-text-green">Budget:</span> ${trip.budget.toFixed(2)}
          </p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {trip.participants?.length || 0} participants
        </div>
        <Link to={`/trips/${trip.id}`} className="neon-button-purple">
          View Trip
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
