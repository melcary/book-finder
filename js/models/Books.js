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
  }


  get authorLabel() {
    return this.authors.length ? this.authors.join(", ") : "Unknown author";
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