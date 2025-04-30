import { useState, useEffect } from "react";
import { fetchResorts, createResort } from "../api/resortApi";
import { CreateResortInput, Resort } from "../api/types";

export function useResorts() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadResorts = async () => {
      setLoading(true);
      try {
        const data = await fetchResorts();
        setResorts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    loadResorts();
  }, []);

  const addResort = async (resort: CreateResortInput) => {
    try {
      const newResort = await createResort(resort);
      if (newResort) {
        setResorts([...resorts, newResort]);
      }
      return newResort;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  return { resorts, loading, error, addResort };
}
