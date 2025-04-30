import React, { useState } from 'react';
import { useResorts } from '../hooks/useResorts';
import ResortCard from '../components/ResortCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ResortsPage: React.FC = () => {
  const { resorts, loading, error } = useResorts();
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredResorts = resorts.filter(resort => {
    const matchesDifficulty = difficultyFilter === 'ALL' || resort.difficulty === difficultyFilter;
    const matchesSearch = resort.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resort.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold neon-text-blue mb-8">Ski Resorts</h1>

      <div className="glass-card mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search resorts..."
              className="w-full px-4 py-2 bg-dark-bg border-2 border-neon-blue focus:border-neon-purple rounded-md focus:outline-none text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 bg-dark-bg border-2 border-neon-purple rounded-md focus:outline-none text-white"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="ALL">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-neon-pink">
          <p>Error loading resorts: {error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.length > 0 ? (
            filteredResorts.map(resort => (
              <ResortCard key={resort.id} resort={resort} />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400 py-12">
              <p className="mb-4">No resorts match your search criteria.</p>
              <button 
                className="neon-button-blue"
                onClick={() => {
                  setSearchTerm('');
                  setDifficultyFilter('ALL');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResortsPage;
