import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { CreateTripInput } from "./types";

const client = generateClient<Schema>();

export const fetchTrips = async () => {
  try {
    const { data, errors } = await client.models.Trip.list();
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
};

export const createTrip = async (trip: CreateTripInput) => {
  try {
    const { data, errors } = await client.models.Trip.create(trip);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error creating trip:", error);
    return null;
  }
};

export const fetchTripDetails = async (tripId: string) => {
  try {
    const { data, errors } = await client.models.Trip.get({ id: tripId });
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error fetching trip details:", error);
    return null;
  }
};
