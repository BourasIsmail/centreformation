import { getCookie } from "cookies-next";
import { api } from ".";
import { CentreFacture } from "../type/CentreFacture";

export async function getFactures(): Promise<CentreFacture[]> {
  const token = getCookie("token");
  const data = await api.get("/factures", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function getFacturesByCentre(): Promise<CentreFacture[]> {
  const token = getCookie("token");
  const data = await api.get("/factures", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function FacturesByCentre(id: number): Promise<CentreFacture[]> {
  const token = getCookie("token");
  const data = await api.get(`/factures/centre/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}