import { getCookie } from "cookies-next";
import { Commune } from "../type/commune";
import { api } from ".";

export async function getCommunes(): Promise<Commune[]> {
  const token = getCookie("token");
  const data = await api.get("/commune/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}

export async function getCommune(id: number): Promise<Commune> {
  const token = getCookie("token");
  const data = await api.get(`/commune/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data as Commune;
}

export async function getCommuneByProvince(id: number): Promise<Commune[]> {
  const token = getCookie("token");
  const data = await api.get(`/commune/byProvince/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
