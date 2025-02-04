import { getCookie } from "cookies-next";
import { Suivie } from "../type/Suivie";
import { api } from ".";

export async function getSuivieByBenef(id: number): Promise<Suivie[]> {
    const token = getCookie("token");
    const data = await api.get(`/Suivie/beneficiaire/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data as Suivie[];
  }
export async function getSuivieById(id: number): Promise<Suivie[]> {
    const token = getCookie("token");
    const data = await api.get(`/Suivie/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data as Suivie[];
}