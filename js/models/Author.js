import { getAuthorPhotoUrl } from "../api/openLibraryService.js";

export class Author {
    constructor({ key, name, bio = "", birthDate = "", deathDate = "", photoUrl = null }) {
    this.key = key;
    this.name = name || "Unknown author";
    this.bio = bio;
    this.birthDate = birthDate;
    this.deathDate = deathDate;
    this.photoUrl = photoUrl;
  }
  get lifespan() {
    if (this.birthDate && this.deathDate) return `${this.birthDate} – ${this.deathDate}`;
    if (this.birthDate) return `b. ${this.birthDate}`;
    return "";
    }
    static fromOpenLibrary(raw) {
    const bioValue = raw.bio;
    const bio = typeof bioValue === "string" ? bioValue : bioValue?.value ?? "";

    return new Author({
      key: raw.key,
      name: raw.name,
      bio,
      birthDate: raw.birth_date ?? "",
      deathDate: raw.death_date ?? "",
      photoUrl: getAuthorPhotoUrl(raw.key),
    });
  }
}