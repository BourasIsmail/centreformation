"use client";

import { api } from "@/app/api";
import { getCentres } from "@/app/api/centre";
import { Centre } from "@/app/type/Centre";
import { use, useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function Home() {
  const [centres, setCentres] = useState<Centre[]>([]);
  const fetchCentres = async () => {
    try {
      const response = await api.get("/centre/all");
      console.log("a", response.data);
      setCentres(response.data);
    } catch (error) {
      console.error("Error fetching centres:", error);
    }
  };
  console.log(fetchCentres);
  console.log(centres);
  return (
    <>
      <h1>test page</h1>
    </>
  );
}
