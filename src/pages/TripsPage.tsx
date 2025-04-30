import React from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TripsPage: React.FC = () => {
  const { trips, loading, error } = useTrips();

  // Sort trips by start date (upcoming first)
  const sortedTrips = [...trips].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold neon-text-purple">My Trips</h1>
        <Link to="/trips/new" className="neon-button-pink">
          + New Trip
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-neon-pink">
          <p>Error loading trips: {error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTrips.length > 0 ? (
            sortedTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <div className="col-span-2 glass-card text-center">
              <h3 className="text-2xl font-bold neon-text-blue mb-4">No trips planned yet</h3>
              <p className="text-gray-300 mb-6">
                Start planning your first ski adventure by creating a new trip.
              </p>
              <Link to="/trips/new" className="neon-button-purple">
                Plan Your First Trip
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripsPage;
