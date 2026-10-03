import { api } from "@/lib/api/api";

export interface OgMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}

export const getOgMetadata = async (url: string): Promise<OgMetadata> => {
  return api.get("og", { searchParams: { url } }).json<OgMetadata>();
};
