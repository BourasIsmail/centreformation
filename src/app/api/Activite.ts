import { api } from ".";

export async function getActivites() {
  try {
    const response = await api.get(`/activite/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
