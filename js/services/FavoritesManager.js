const STORAGE_KEY = "bookfinder:favorites";
export class FavoritesManager {
  getAll() {
    throw new Error("FavoritesManager.getAll is not implemented yet (planned for Week 6).");
  }

  add(_book) {
    throw new Error("FavoritesManager.add is not implemented yet (planned for Week 6).");
  }

  remove(_bookId) {
    throw new Error("FavoritesManager.remove is not implemented yet (planned for Week 6).");
    }
    
  isFavorite(_bookId) {
    throw new Error("FavoritesManager.isFavorite is not implemented yet (planned for Week 6).");
  }
}

export const FAVORITES_STORAGE_KEY = STORAGE_KEY;