import { getCookie } from "cookies-next";
import { Suivie } from "../type/Suivie";
import { api } from ".";

export async function getSuivieById(id: number): Promise<Suivie[]> {
    const token = getCookie("token");
    const data = await api.get(`/suivies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data as Suivie[];
}
export async function SuiviesByBeneficiaire(id: number): Promise<Suivie[]> {
  const token = getCookie("token");
  const data = await api.get(`/suivies/beneficiaire/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}