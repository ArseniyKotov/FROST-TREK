import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResortsPage from './pages/ResortsPage';
import ResortDetailPage from './pages/ResortDetailPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import NewTripPage from './pages/NewTripPage';

const client = generateClient<Schema>();

// Mock data for initial seeding
const mockResorts = [
  {
    name: 'Powder Mountain',
    location: 'Eden, Utah',
    description:
      'Experience the thrill of untouched powder across vast terrain with breathtaking mountain views. Powder Mountain offers an authentic ski experience with minimal crowds and maximum adventure.',
    difficulty: 'ADVANCED',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256',
    elevation: 2650,
    numberOfTrails: 154,
  },
  {
    name: 'Neon Slopes',
    location: 'Aspen, Colorado',
    description:
      'The most vibrant and energetic resort in the Rockies. Featuring night skiing with LED-lit trails and a world-class après-ski scene that keeps the party going until dawn.',
    difficulty: 'INTERMEDIATE',
    imageUrl: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
    elevation: 3417,
    numberOfTrails: 91,
  },
  {
    name: 'Glacier Peak',
    location: 'Whistler, Canada',
    description:
      'A stunning alpine environment with glacier views and pristine conditions. The resort features some of the most challenging expert runs in North America alongside gentle slopes for beginners.',
    difficulty: 'EXPERT',
    imageUrl:
      'https://media.cntraveler.com/photos/67589544aad4a6bf27e9de89/16:9/w_2560%2Cc_limit/GettyImages-1135607220.jpg',
    elevation: 2284,
    numberOfTrails: 200,
  },
  {
    name: 'Sunset Valley',
    location: 'Park City, Utah',
    description:
      'Family-friendly resort with spectacular sunset views across the valley. Perfect for beginners and intermediates with excellent ski schools and wide, groomed runs.',
    difficulty: 'BEGINNER',
    imageUrl: 'https://images.unsplash.com/photo-1579755209948-20d5b46be7be',
    elevation: 2103,
    numberOfTrails: 58,
  },
];

function App() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [seedingError, setSeedingError] = useState<Error | null>(null);

  useEffect(() => {
    const seedDatabase = async () => {
      // Check if we've already seeded the database in this session
      const hasSeeded = sessionStorage.getItem('dbSeeded');
      if (hasSeeded === 'true') {
        console.log('Database already seeded in this session');
        return;
      }

      setIsSeeding(true);
      setSeedingError(null);

      try {
        // First check if we already have data to avoid duplicates
        const { data: existingResorts, errors: listErrors } =
          await client.models.Resort.list({
            limit: 1,
          });

        if (listErrors) {
          throw new Error(
            `Error checking existing resorts: ${listErrors[0].message}`
          );
        }

        // If we already have data, don't seed
        if (existingResorts.length > 0) {
          console.log('Database already has data, skipping seed');
          sessionStorage.setItem('dbSeeded', 'true');
          setIsSeeding(false);
          setSeedingComplete(true);
          return;
        }

        console.log('Seeding database with mock data...');

        // Create each resort from the mock data
        for (const resort of mockResorts) {
          const { errors: createErrors } =
            await client.models.Resort.create(resort);

          if (createErrors) {
            throw new Error(
              `Error creating resort: ${createErrors[0].message}`
            );
          }
        }

        console.log(
          `Successfully seeded database with ${mockResorts.length} resorts`
        );
        sessionStorage.setItem('dbSeeded', 'true');
        setSeedingComplete(true);
      } catch (error) {
        console.error('Error seeding database:', error);
        setSeedingError(
          error instanceof Error
            ? error
            : new Error('Unknown error during seeding')
        );
      } finally {
        setIsSeeding(false);
      }
    };

    seedDatabase();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-darker-bg to-dark-bg text-white">
            <Navbar />
            <main className="pb-16">
              {isSeeding && (
                <div className="container mx-auto px-4 py-2">
                  <div className="bg-neon-blue bg-opacity-20 border border-neon-blue rounded p-2 text-center">
                    <p className="text-neon-blue">Initializing app data...</p>
                  </div>
                </div>
              )}

              {seedingError && (
                <div className="container mx-auto px-4 py-2">
                  <div className="bg-neon-pink bg-opacity-20 border border-neon-pink rounded p-2 text-center">
                    <p className="text-neon-pink">
                      Error initializing data: {seedingError.message}
                    </p>
                  </div>
                </div>
              )}

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resorts" element={<ResortsPage />} />
                <Route path="/resorts/:id" element={<ResortDetailPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trips/new" element={<NewTripPage />} />
                <Route path="/trips/:id" element={<TripDetailPage />} />
              </Routes>
            </main>

            <footer className="py-6 border-t border-gray-800">
              <div className="container mx-auto px-4 text-center">
                <p className="text-gray-400">
                  FROST<span className="text-neon-pink">TREK</span> • The
                  Ultimate Ski Trip Planner
                </p>
                <div className="mt-2 flex justify-center space-x-4">
                  <button
                    onClick={() => signOut()}
                    className="text-neon-blue hover:text-neon-pink"
                  >
                    Sign Out
                  </button>
                  <p className="text-gray-500">|</p>
                  <p className="text-gray-500">Signed in as: {user.username}</p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
