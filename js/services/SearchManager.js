import { searchBooks } from "../api/googleBooksService.js";
import { Book } from "../models/Book.js";

export class SearchManager {
    async search(query) {
    const trimmedQuery = query?.trim() ?? "";

    if (!trimmedQuery) {
      return { books: [], query: trimmedQuery };
    }

    const rawVolumes = await searchBooks(trimmedQuery, { maxResults: this.maxResults });
    const books = rawVolumes.map((volume) => Book.fromGoogleBooks(volume));

    return { books, query: trimmedQuery };
  }
}