const STORAGE_KEY = "bookfinder:favorites";
export class FavoritesManager {
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  add(book) {
    const favorites = this.getAll();
    if (favorites.some((fav) => fav.id === book.id)) return;

    favorites.push({
      id: book.id,
      title: book.title,
      author: book.authorLabel ?? "Unknown author",
      coverUrl: book.coverUrl ?? null,
      source: book.source ?? "google-books",
    });

    this._save(favorites);
  }

  remove(bookId) {
     const favorites = this.getAll().filter((fav) => fav.id !== bookId);
    this._save(favorites);
  }

  isFavorite(bookId) {
    return this.getAll().some((fav) => fav.id === bookId);
  }

  toggle(book) {
    if (this.isFavorite(book.id)) {
      this.remove(book.id);
      return false;
    }
    this.add(book);
    return true;
  }
  
   _save(favorites) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage full or unavailable (e.g. private browsing) fail silently,
      // the UI simply won't persist across reloads.
    }
  }
}

export const FAVORITES_STORAGE_KEY = STORAGE_KEY;