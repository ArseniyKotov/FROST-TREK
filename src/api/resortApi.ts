import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { CreateResortInput } from "./types";

const client = generateClient<Schema>();

export const fetchResorts = async () => {
  try {
    const { data, errors } = await client.models.Resort.list();
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error fetching resorts:", error);
    return [];
  }
};

export const createResort = async (resort: CreateResortInput) => {
  try {
    const { data, errors } = await client.models.Resort.create(resort);
    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Error creating resort:", error);
    return null;
  }
};
