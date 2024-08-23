import { SearchApiClient } from "./api";

export function getBookList(searchTerms, page) {
  return SearchApiClient.get("/search.json", {
    q: searchTerms,
    page,
  });
}

export function getBookDetails() {}

export function getBookCover() {}
