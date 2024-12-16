import { getCookie } from "cookies-next";
import { ProprieteDuCentre } from "../type/ProprieteDuCentre";
import { api } from ".";

export async function getProprieteDuCentres(): Promise<ProprieteDuCentre[]> {
  const token = getCookie("token");
  const data = await api.get("/ProprieteDuCentre/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
