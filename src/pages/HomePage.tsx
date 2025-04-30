import React from 'react';
import { Link } from 'react-router-dom';
import { useResorts } from '../hooks/useResorts';
import { useTrips } from '../hooks/useTrips';
import ResortCard from '../components/ResortCard';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { resorts, loading: loadingResorts } = useResorts();
  const { trips, loading: loadingTrips } = useTrips();

  const featuredResorts = resorts.slice(0, 3);
  const upcomingTrips = trips.slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          <span className="neon-text-blue">FROST</span>
          <span className="neon-text-pink">TREK</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">Plan your next epic ski adventure with style</p>
        <div className="flex justify-center gap-4">
          <Link to="/resorts" className="neon-button-blue">
            Explore Resorts
          </Link>
          <Link to="/trips/new" className="neon-button-pink">
            Plan New Trip
          </Link>
        </div>
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold neon-text-blue">Featured Resorts</h2>
          <Link to="/resorts" className="neon-text-blue hover:neon-text-purple transition-all">
            View All →
          </Link>
        </div>
        {loadingResorts ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResorts.length > 0 ? (
              featuredResorts.map(resort => (
                <ResortCard key={resort.id} resort={resort} />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400">No resorts found. Add some resorts to get started.</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold neon-text-purple">Upcoming Trips</h2>
          <Link to="/trips" className="neon-text-purple hover:neon-text-blue transition-all">
            View All →
          </Link>
        </div>
        {loadingTrips ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-400">No upcoming trips. Plan your first adventure!</p>
            )}
          </div>
        )}
      </div>

      <div className="glass-card text-center">
        <h2 className="text-2xl font-bold neon-text-green mb-4">Ready for the slopes?</h2>
        <p className="text-gray-300 mb-6">
          Track your ski trips, find the best resorts, and plan your next adventure with friends.
        </p>
        <Link to="/trips/new" className="neon-button-green">
          Start Planning
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
