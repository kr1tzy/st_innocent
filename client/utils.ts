import { baseUrl } from "@/api";

/*
 * Generates a raw image url.
 */
export const imageUrl = (id: string) => `${baseUrl}/images/${id}?raw=true`;
