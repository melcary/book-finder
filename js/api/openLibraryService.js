const BASE_URL = "https://openlibrary.org";
const COVERS_BASE_URL = "https://covers.openlibrary.org";

export async function searchOpenLibrary(query, options = {}) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return [];

  const { limit = 5 } = options;

  const url = new URL(`${BASE_URL}/search.json`);
  url.searchParams.set("q", trimmedQuery);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set(
    "fields",
    "key,title,author_name,author_key,first_publish_year,subject,cover_edition_key"
  );
  
  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Open Library API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.docs ?? [];
}
export async function findBestMatch(title, author = "") {
  if (!title?.trim()) return null;

  const query = author ? `${title} ${author}` : title;
  const docs = await searchOpenLibrary(query, { limit: 3 });
  if (!docs.length) return null;

  const normalizedTitle = title.trim().toLowerCase();
  const closeMatch = docs.find((doc) => doc.title?.trim().toLowerCase() === normalizedTitle);

  return closeMatch ?? docs[0];
}
export async function getWorkById(workKey) {
  const cleanKey = workKey.replace(/^\/works\//, "");
  const response = await fetch(`${BASE_URL}/works/${encodeURIComponent(cleanKey)}.json`);

  if (!response.ok) {
    throw new Error(`Open Library API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
export async function getAuthorByKey(authorKey) {
  const cleanKey = authorKey.replace(/^\/authors\//, "");
  const response = await fetch(`${BASE_URL}/authors/${encodeURIComponent(cleanKey)}.json`);

  if (!response.ok) {
    throw new Error(`Open Library API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
export function getAuthorPhotoUrl(authorKey, size = "M") {
  if (!authorKey) return null;
  const cleanKey = authorKey.replace(/^\/authors\//, "");
  return `${COVERS_BASE_URL}/a/olid/${encodeURIComponent(cleanKey)}-${size}.jpg`;
}

export const OPEN_LIBRARY_BASE_URL = BASE_URL;