import { getCookie } from "cookies-next";
import { api } from ".";
import { CentreFacture } from "../type/CentreFacture";

export async function getFactures(): Promise<CentreFacture[]> {
  const token = getCookie("token");
  const data = await api.get("/facture/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function getFactureByCentre(id: number): Promise<CentreFacture[]> {
  const token = getCookie("token");
  const data = await api.get(`/facture/Centre/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}