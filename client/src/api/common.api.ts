import { API_ENDPOINTS } from "@/lib/constants";
import { apiClient } from "@/api/client";

export type HealthResponse = {
  status: "ok";
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await apiClient.get(API_ENDPOINTS.common.health);

  return response.data;
}
