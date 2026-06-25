import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/api/common.api";
import { QUERY_KEYS } from "@/lib/constants";

export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: getHealth,
    refetchInterval: 30_000,
  });
}
