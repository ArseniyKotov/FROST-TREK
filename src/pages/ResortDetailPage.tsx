import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import LoadingSpinner from '../components/LoadingSpinner';

const client = generateClient<Schema>();

const ResortDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resort, setResort] = useState<Schema['Resort'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResortDetails = async () => {
      if (!id) return;
      
      try {
        const { data, errors } = await client.models.Resort.get({ id });
        
        if (errors) {
          throw new Error(errors[0].message);
        }
        
        setResort(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch resort details'));
        console.error('Error fetching resort details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResortDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-neon-pink mb-4">Error: {error.message}</p>
        <Link to="/resorts" className="neon-button-blue">
          Back to Resorts
        </Link>
      </div>
    );
  }

  if (!resort) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-neon-pink mb-4">Resort not found</p>
        <Link to="/resorts" className="neon-button-blue">
          Back to Resorts
        </Link>
      </div>
    );
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/resorts" className="neon-text-blue hover:neon-text-purple transition-all">
          ← Back to Resorts
        </Link>
      </div>

      <div className="glass-card neon-border-blue mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 mb-4 overflow-hidden rounded">
              <img 
                src={resort.imageUrl || `https://source.unsplash.com/random/1200x800/?ski,resort,snow,mountain&${resort.id}`} 
                alt={resort.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold neon-text-blue mb-2">{resort.name}</h1>
            <p className="text-xl text-gray-300 mb-4">{resort.location}</p>
            
            <div className="mb-6">
              <p className={`text-lg font-bold ${getDifficultyColor(resort.difficulty)}`}>
                {resort.difficulty || 'UNKNOWN'} DIFFICULTY
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card text-center">
                <p className="text-sm text-gray-400">Elevation</p>
                <p className="text-2xl neon-text-green">{resort.elevation}m</p>
              </div>
              <div className="glass-card text-center">
                <p className="text-sm text-gray-400">Trails</p>
                <p className="text-2xl neon-text-purple">{resort.numberOfTrails}</p>
              </div>
            </div>
            
            <Link to={`/trips/new?resortId=${resort.id}`} className="neon-button-pink w-full block text-center">
              Plan Trip Here
            </Link>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold neon-text-purple mb-4">About this Resort</h2>
          <p className="text-gray-300 leading-relaxed">
            {resort.description || 'No description available for this resort.'}
          </p>
        </div>
      </div>
      
      <div className="glass-card">
        <h2 className="text-2xl font-bold neon-text-green mb-4">Upcoming Trips to {resort.name}</h2>
        <p className="text-gray-400">
          No upcoming trips planned for this resort yet.
        </p>
        <div className="mt-4">
          <Link to={`/trips/new?resortId=${resort.id}`} className="neon-button-green">
            Be the First to Plan a Trip
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResortDetailPage;
