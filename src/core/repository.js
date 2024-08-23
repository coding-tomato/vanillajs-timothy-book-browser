import { SearchApiClient } from "./api";

export async function getBookList(searchTerms, page, limit) {
  const data = await SearchApiClient.get("/search.json", {
    q: searchTerms,
    page,
    limit,
    fields: 'title'
  });

  return data.docs;
}

export function getBookDetails() {}

export function getBookCover() {}
