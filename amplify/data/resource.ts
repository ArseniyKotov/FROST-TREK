import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a
  .schema({
    Resort: a.model({
      id: a.id(),
      name: a.string().required(),
      location: a.string().required(),
      description: a.string(),
      difficulty: a.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
      imageUrl: a.string(),
      elevation: a.integer(),
      numberOfTrails: a.integer(),
      trips: a.hasMany("Trip", "resortId"),
    }),
    
    Trip: a.model({
      id: a.id(),
      name: a.string().required(),
      startDate: a.datetime().required(),
      endDate: a.datetime().required(),
      budget: a.float(),
      notes: a.string(),
      resortId: a.id(),
      resort: a.belongsTo("Resort", "resortId"),
      participants: a.hasMany("Participant", "tripId"),
      activities: a.hasMany("Activity", "tripId"),
    }),
    
    Participant: a.model({
      id: a.id(),
      name: a.string().required(),
      email: a.string(),
      skillLevel: a.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
      tripId: a.id(),
      trip: a.belongsTo("Trip", "tripId"),
    }),
    
    Activity: a.model({
      id: a.id(),
      name: a.string().required(),
      date: a.datetime().required(),
      duration: a.integer(),
      type: a.enum(["SKI", "SNOWBOARD", "APRES_SKI", "DINING", "OTHER"]),
      tripId: a.id(),
      trip: a.belongsTo("Trip", "tripId"),
    }),
  })
  .authorization((allow) => [
    allow.publicApiKey(),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
