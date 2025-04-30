import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResorts } from '../hooks/useResorts';
import { useTrips } from '../hooks/useTrips';
import { CreateTripInput } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';

const NewTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedResortId = searchParams.get('resortId');
  
  const { resorts, loading: loadingResorts } = useResorts();
  const { addTrip, loading: savingTrip } = useTrips();
  
  const [formData, setFormData] = useState<CreateTripInput>({
    name: '',
    startDate: '',
    endDate: '',
    budget: undefined,
    notes: '',
    resortId: preselectedResortId || '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (preselectedResortId) {
      setFormData(prev => ({ ...prev, resortId: preselectedResortId }));
    }
  }, [preselectedResortId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Trip name is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!formData.resortId) {
      errors.resortId = 'Please select a resort';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTrip = await addTrip(formData);
      
      if (newTrip) {
        navigate(`/trips/${newTrip.id}`);
      } else {
        throw new Error('Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      setFormErrors(prev => ({ ...prev, submit: 'Failed to create trip. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold neon-text-pink mb-8">Plan New Trip</h1>
      
      <div className="glass-card neon-border-pink">
        {loadingResorts ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Trip Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-dark-bg border-2 ${
                  formErrors.name ? 'border-neon-pink' : 'border-neon-purple'
                } rounded-md focus:outline-none text-white`}
                placeholder="Winter Adventure 2023"
              />
              {formErrors.name && (
                <p className="mt-1 text-neon-pink text-sm">{formErrors.name}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="startDate" className="block text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-dark-bg border-2 ${
                    formErrors.startDate ? 'border-neon-pink' : 'border-neon-blue'
                  } rounded-md focus:outline-none text-white`}
                />
                {formErrors.startDate && (
                  <p className="mt-1 text-neon-pink text-sm">{formErrors.startDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-dark-bg border-2 ${
                    formErrors.endDate ? 'border-neon-pink' : 'border-neon-blue'
                  } rounded-md focus:outline-none text-white`}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-neon-pink text-sm">{formErrors.endDate}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="resortId" className="block text-gray-300 mb-2">
                Resort
              </label>
              <select
                id="resortId"
                name="resortId"
                value={formData.resortId}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-dark-bg border-2 ${
                  formErrors.resortId ? 'border-neon-pink' : 'border-neon-green'
                } rounded-md focus:outline-none text-white`}
              >
                <option value="">Select a resort</option>
                {resorts.map(resort => (
                  <option key={resort.id} value={resort.id}>
                    {resort.name} - {resort.location}
                  </option>
                ))}
              </select>
              {formErrors.resortId && (
                <p className="mt-1 text-neon-pink text-sm">{formErrors.resortId}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="budget" className="block text-gray-300 mb-2">
                Budget (Optional)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark-bg border-2 border-neon-blue rounded-md focus:outline-none text-white"
                placeholder="1000"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-dark-bg border-2 border-neon-purple rounded-md focus:outline-none text-white"
                placeholder="Any special plans or things to remember..."
              ></textarea>
            </div>
            
            {formErrors.submit && (
              <div className="mb-6 p-3 bg-neon-pink bg-opacity-20 border border-neon-pink rounded-md">
                <p className="text-neon-pink">{formErrors.submit}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="neon-button-blue"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="neon-button-pink"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Trip'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewTripPage;
