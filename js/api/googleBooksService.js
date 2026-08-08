
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = "AIzaSyDWanghHALmPtZ6e6BxwVGNyUNbe40BllA"

export async function searchBooks(query, options = {}) {
    const trimmedQuery = query?.trim();
    if (!trimmedQuery) return [];

    const { maxResults = 20, startIndex = 0 } = options;

    const url = new URL(BASE_URL);
    url.searchParams.set("q", trimmedQuery);
    url.searchParams.set("maxResults", String(Math.min(maxResults, 40)));
    url.searchParams.set("startIndex", String(startIndex));
    url.searchParams.set("key", API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items ?? [];
}

export async function getVolumeById(volumeId) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(volumeId)}`);
    url.searchParams.set("key", API_KEY);

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}