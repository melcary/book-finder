const FALLBACK_COVER = null; 

export class Book {
  constructor({
    id,
    title,
    authors = [],
    description = "",
    coverUrl = FALLBACK_COVER,
    pageCount = null,
    averageRating = null,
    categories = [],
    publishedDate = "",
    previewLink = null,
    source = "google-books",
    subjects = [],
    openLibraryWorkKey = null,
    openLibraryAuthorKeys = [],
  }) {
    this.id = id;
    this.title = title || "Untitled";
    this.authors = authors;
    this.description = description;
    this.coverUrl = coverUrl;
    this.pageCount = pageCount;
    this.averageRating = averageRating;
    this.categories = categories;
    this.publishedDate = publishedDate;
    this.previewLink = previewLink;
    this.source = source;
    this.subjects = subjects;
    this.openLibraryWorkKey = openLibraryWorkKey;
    this.openLibraryAuthorKeys = openLibraryAuthorKeys;
  }


  get authorLabel() {
    return this.authors.length ? this.authors.join(", ") : "Unknown author";
  }
  get displayTags() {
    const merged = [...this.categories, ...this.subjects];
    const unique = [...new Set(merged.map((tag) => tag.trim()).filter(Boolean))];
    return unique.slice(0, 8);
  }
   enrichWithOpenLibrary(olDoc, olWork = null) {
    if (!olDoc) return this;

    this.openLibraryWorkKey = olDoc.key ?? this.openLibraryWorkKey;
    this.openLibraryAuthorKeys = olDoc.author_key ?? this.openLibraryAuthorKeys;
    this.subjects = olDoc.subject ?? this.subjects;

    if (!this.description && olWork) {
      const workDescription = olWork.description;
      this.description =
        typeof workDescription === "string" ? workDescription : workDescription?.value ?? "";
    }

    return this;
  }

  static fromGoogleBooks(volume) {
    const info = volume.volumeInfo ?? {};
    const imageLinks = info.imageLinks ?? {};

    return new Book({
      id: volume.id,
      title: info.title,
      authors: info.authors ?? [],
      description: info.description ?? "",
      coverUrl: imageLinks.thumbnail?.replace("http://", "https://") ?? FALLBACK_COVER,
      pageCount: info.pageCount ?? null,
      averageRating: info.averageRating ?? null,
      categories: info.categories ?? [],
      publishedDate: info.publishedDate ?? "",
      previewLink: info.previewLink ?? null,
      source: "google-books",
    });
  }
}