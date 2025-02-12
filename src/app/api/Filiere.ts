import { getCookie } from "cookies-next";
import { Filiere } from "../type/Filiere";
import { api } from ".";

export async function getFilieres(): Promise<Filiere[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/filiere/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getFilieresByTypeActivite(
  id: number
): Promise<Filiere[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/filiere/typeActivite/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getFiliereByActivite(id: number): Promise<Filiere[]> {
  const token = getCookie("token");
  const data = await api.get(`/filiere/byActivite/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}

