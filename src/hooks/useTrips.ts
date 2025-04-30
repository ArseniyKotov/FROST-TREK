import { useState, useEffect } from "react";
import { fetchTrips, createTrip, fetchTripDetails } from "../api/tripApi";
import { CreateTripInput, Trip } from "../api/types";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const addTrip = async (trip: CreateTripInput) => {
    try {
      const newTrip = await createTrip(trip);
      if (newTrip) {
        setTrips([...trips, newTrip]);
      }
      return newTrip;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  const getTripDetails = async (tripId: string) => {
    setLoading(true);
    try {
      const trip = await fetchTripDetails(tripId);
      return trip;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { trips, loading, error, addTrip, getTripDetails };
}
