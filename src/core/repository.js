import { CoverIdApiClient, SearchApiClient } from "./api";

export async function getBookList(searchTerms, page, limit) {
  const response = await SearchApiClient.get("/search.json", {
    title: searchTerms,
    page,
    limit,
    fields: "title, author_name, key, cover_i",
    lang: "es",
  });

  const data = response.docs.map((book) => ({
    id: book.key.split("/").pop(),
    title: book.title,
    authorName: book.author_name,
    coverId: book.cover_i,
  }));

  return data;
}

export function getBookDetails() {}

const availableSizes = ["S", "M", "L"];
export async function getBookCover(coverId, size) {
  if (!availableSizes.includes(size)) {
    throw new Error("Unsupported image size requested.");
  }

  const blob = await CoverIdApiClient.get(`/${coverId}-${size}.jpg`);
  const imageUrl = URL.createObjectURL(blob);

  return imageUrl;
}
