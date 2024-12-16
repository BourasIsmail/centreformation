import { getCookie } from "cookies-next";
import { Personnel } from "../type/Personnel";
import { api } from ".";

export async function getPersonnelByProvince(
  providerId: number
): Promise<Personnel[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/personnel/province/${providerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPersonnelByCommune(
  providerId: number
): Promise<Personnel[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/personnel/commune/${providerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPersonnels(): Promise<Personnel[]> {
  try {
    const token = getCookie("token");
    const response = await api.get(`/personnel/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
