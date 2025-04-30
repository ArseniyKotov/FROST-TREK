import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import LoadingSpinner from '../components/LoadingSpinner';

const client = generateClient<Schema>();

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Schema['Trip'] | null>(null);
  const [resort, setResort] = useState<Schema['Resort'] | null>(null);
  const [participants, setParticipants] = useState<Schema['Participant'][]>([]);
  const [activities, setActivities] = useState<Schema['Activity'][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!id) return;
      
      try {
        // Fetch trip details
        const { data: tripData, errors: tripErrors } = await client.models.Trip.get({ id });
        
        if (tripErrors) {
          throw new Error(tripErrors[0].message);
        }
        
        setTrip(tripData);
        
        if (tripData?.resortId) {
          // Fetch resort details
          const { data: resortData, errors: resortErrors } = await client.models.Resort.get({ 
            id: tripData.resortId 
          });
          
          if (resortErrors) {
            console.error('Error fetching resort:', resortErrors);
          } else {
            setResort(resortData);
          }
        }
        
        // Fetch participants
        const { data: participantsData, errors: participantsErrors } = await client.models.Participant.list({
          filter: { tripId: { eq: id } }
        });
        
        if (participantsErrors) {
          console.error('Error fetching participants:', participantsErrors);
        } else {
          setParticipants(participantsData);
        }
        
        // Fetch activities
        const { data: activitiesData, errors: activitiesErrors } = await client.models.Activity.list({
          filter: { tripId: { eq: id } }
        });
        
        if (activitiesErrors) {
          console.error('Error fetching activities:', activitiesErrors);
        } else {
          setActivities(activitiesData);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch trip details'));
        console.error('Error fetching trip details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-neon-pink mb-4">Error: {error.message}</p>
        <Link to="/trips" className="neon-button-blue">
          Back to Trips
        </Link>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-neon-pink mb-4">Trip not found</p>
        <Link to="/trips" className="neon-button-blue">
          Back to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/trips" className="neon-text-purple hover:neon-text-blue transition-all">
          ← Back to Trips
        </Link>
      </div>

      <div className="glass-card neon-border-purple mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-4xl font-bold neon-text-purple mb-2 md:mb-0">{trip.name}</h1>
          <div className="flex gap-2">
            <button className="neon-button-green">Edit Trip</button>
            <button className="neon-button-pink">Delete</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card text-center">
            <p className="text-sm text-gray-400">Dates</p>
            <p className="text-lg neon-text-blue">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </div>
          
          <div className="glass-card text-center">
            <p className="text-sm text-gray-400">Resort</p>
            <p className="text-lg neon-text-green">
              {resort ? (
                <Link to={`/resorts/${resort.id}`} className="hover:underline">
                  {resort.name}
                </Link>
              ) : (
                'Unknown Resort'
              )}
            </p>
          </div>
          
          <div className="glass-card text-center">
            <p className="text-sm text-gray-400">Budget</p>
            <p className="text-lg neon-text-pink">
              {trip.budget ? `$${trip.budget.toFixed(2)}` : 'Not specified'}
            </p>
          </div>
        </div>
        
        {trip.notes && (
          <div className="mb-8">
            <h2 className="text-xl font-bold neon-text-blue mb-2">Notes</h2>
            <div className="glass-card">
              <p className="text-gray-300">{trip.notes}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card neon-border-green">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold neon-text-green">Participants</h2>
            <button className="neon-button-green">Add Person</button>
          </div>
          
          {participants.length > 0 ? (
            <div className="space-y-4">
              {participants.map(person => (
                <div key={person.id} className="glass-card flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{person.name}</p>
                    <p className="text-sm text-gray-400">{person.email}</p>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      person.skillLevel === 'BEGINNER' ? 'bg-neon-green bg-opacity-20 text-neon-green' :
                      person.skillLevel === 'INTERMEDIATE' ? 'bg-neon-blue bg-opacity-20 text-neon-blue' :
                      person.skillLevel === 'ADVANCED' ? 'bg-neon-purple bg-opacity-20 text-neon-purple' :
                      'bg-neon-pink bg-opacity-20 text-neon-pink'
                    }`}>
                      {person.skillLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No participants added yet. Add some people to your trip!
            </p>
          )}
        </div>
        
        <div className="glass-card neon-border-blue">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold neon-text-blue">Activities</h2>
            <button className="neon-button-blue">Add Activity</button>
          </div>
          
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="glass-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{activity.name}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(activity.date).toLocaleDateString()} • {activity.duration} min
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full ${
                        activity.type === 'SKI' ? 'bg-neon-blue bg-opacity-20 text-neon-blue' :
                        activity.type === 'SNOWBOARD' ? 'bg-neon-green bg-opacity-20 text-neon-green' :
                        activity.type === 'APRES_SKI' ? 'bg-neon-purple bg-opacity-20 text-neon-purple' :
                        activity.type === 'DINING' ? 'bg-neon-pink bg-opacity-20 text-neon-pink' :
                        'bg-gray-500 bg-opacity-20 text-gray-300'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No activities planned yet. Add some to your itinerary!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
