import { getCookie } from "cookies-next";
import { api } from ".";
import { Activite } from "../type/Activite";


export async function getActivites(): Promise<Activite[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/activite/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getActiviteByCentre(id: number): Promise<Activite[]> {
  const token = getCookie("token");
  const data = await api.get(`/activite/byCentre/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function getactiviteById(id: number): Promise<Activite> {
  const token = getCookie("token");
  const data = await api.get(`/activite/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
