import { getCookie } from "cookies-next";
import { api } from ".";
import { Beneficiaire } from "../type/Beneficiaire";

export async function getBenefs(): Promise<Beneficiaire[]> {
  const token = getCookie("token");
  const data = await api.get("/beneficiaire/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
