import { Schema } from "../../amplify/data/resource";

export type Resort = Schema["Resort"];
export type Trip = Schema["Trip"];
export type Participant = Schema["Participant"];
export type Activity = Schema["Activity"];

export type CreateResortInput = Omit<Resort, "id" | "trips">;
export type CreateTripInput = Omit<Trip, "id" | "participants" | "activities" | "resort">;
export type CreateParticipantInput = Omit<Participant, "id" | "trip">;
export type CreateActivityInput = Omit<Activity, "id" | "trip">;
