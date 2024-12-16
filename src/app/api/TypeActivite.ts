import { getCookie } from "cookies-next";
import { TypeActivite } from "../type/TypeActivite";
import { api } from ".";

export async function getTypeActivites(): Promise<TypeActivite[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/TypeActivite/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
