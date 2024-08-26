import { SearchApiClient } from "./api";

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

export function getBookCover() {}
