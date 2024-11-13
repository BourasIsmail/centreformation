import { getCookie } from "cookies-next";
import { TypeCentre } from "../type/TypeCentre";
import { api } from ".";

export async function getTypeCentre(): Promise<TypeCentre[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/typeCentre`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
