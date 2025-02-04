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