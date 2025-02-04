import axios, { AxiosError } from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { UserInfo } from "../type/UserInfo";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    if (error.response?.status === 403) {
      console.error("Forbidden access");
      //deleteCookie("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api };

export async function getUsers(): Promise<UserInfo[]> {
  const { data } = await api.get<UserInfo[]>("/auth/getUsers");
  return data;
}

async function tokenPayload(): Promise<string | null> {
  const token = getCookie("token");
  if (!token || typeof token !== "string") return null;
  try {
    const [, payload] = token.split(".");
    const decodedPayload = atob(payload);
    const { sub } = JSON.parse(decodedPayload);
    return sub;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<UserInfo | null> {
  const email = await tokenPayload();
  if (!email) return null;
  const { data } = await api.get<UserInfo>(`/auth/email/${email}`);
  return data;
}

export async function logout(): Promise<void> {
  deleteCookie("token", { path: "/" });
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function getUser(id: number): Promise<UserInfo | undefined> {
  try {
    const { data } = await api.get<UserInfo>(`/auth/getUser/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
