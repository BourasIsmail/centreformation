import { getCookie } from "cookies-next";
import { api } from ".";
import { Beneficiaire } from "../type/Beneficiaire";

export async function getBenefs(): Promise<Beneficiaire[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/beneficiaire/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getbeneficiaireById(id: number): Promise<Beneficiaire> {
  const token = getCookie("token");
  const data = await api.get(`/beneficiaire/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
