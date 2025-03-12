import { getCookie } from "cookies-next";
import { Centre } from "../type/Centre";
import { api } from ".";

export async function getCentres(): Promise<Centre[]> {
  const token = getCookie("token");
  const data = await api.get("/centres", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function getCentreByProvince(id: number): Promise<Centre[]> {
  const token = getCookie("token");
  const data = await api.get(`/centres/Province/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
export async function getCentreById(id: number): Promise<Centre[]> {
  const token = getCookie("token");
  const data = await api.get(`/centres/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}