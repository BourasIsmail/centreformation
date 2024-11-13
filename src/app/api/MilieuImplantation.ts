import { get } from "http";
import { api } from ".";
import { MilieuImplantation } from "../type/MilieuImplantation";
import { getCookie } from "cookies-next";

export async function getMilieuImplantation(): Promise<MilieuImplantation[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/MilieuImplantation/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
