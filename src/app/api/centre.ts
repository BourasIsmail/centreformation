import { getCookie } from "cookies-next";
import { Centre } from "../type/Centre";
import { api } from ".";

export async function getCentres(): Promise<Centre[]> {
  const token = getCookie("token");
  const data = await api.get("/centre/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function getCentreByProvince(id: number): Promise<Centre[]> {
  const token = getCookie("token");
  const data = await api.get(`/centre/ByProvince/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}