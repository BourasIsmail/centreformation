"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { api } from "@/app/api";

export function DebugCommuneApi() {
  const [error, setError] = useState<string | null>(null);
  const [communes, setCommunes] = useState<any[]>([]);

  useEffect(() => {
    const fetchCommunes = async () => {
      const token = getCookie("token");
      try {
        const response = await api.get("/commune/byProvince/1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCommunes(response.data);
      } catch (err: any) {
        setError(err.message);
        console.error("Full error:", err);
      }
    };

    fetchCommunes();
  }, []);

  return (
    <div>
      <h1>Debug Commune API</h1>
      {error && <p>Error: {error}</p>}
      {communes.length > 0 && (
        <ul>
          {communes.map((commune) => (
            <li key={commune.id}>{commune.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
