import { useQuery } from "@tanstack/react-query";
import { getOgMetadata } from "../api/og.service";

export function useOgMetadataQuery(url: string | null) {
  return useQuery({
    queryKey: ["og", url],
    queryFn: () => getOgMetadata(url!),
    enabled: !!url,
    staleTime: 60 * 60 * 1000, // 1시간 캐시
  });
}
