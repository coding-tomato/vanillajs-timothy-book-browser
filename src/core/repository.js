import { CoverIdApiClient, SearchApiClient } from "./api";
import { ApiError } from "./exceptions";

export async function getBookList(searchTerms, page, limit) {
  const response = await SearchApiClient.get("/search.json", {
    q: `title:${searchTerms} AND language:eng`,
    page,
    limit,
    fields: "title,author_name, key,cover_i",
    lang: "en",
  });

  const data = response.docs.map((book) => ({
    id: book.key.split("/").pop(),
    title: book.title,
    authorName: book.author_name,
    coverId: book.cover_i,
  }));

  return {
    books: data,
    pageCount: Math.ceil(response.numFound / limit),
  };
}

export async function getBookDetails(bookId) {
  try {
    const response = await SearchApiClient.get(`/works/${bookId}.json`);
    return response;
  } catch (e) {
    throw new ApiError("Error getting book details");
  }
}

const availableSizes = ["S", "M", "L"];
export async function getBookCover(coverId, size) {
  if (!availableSizes.includes(size)) {
    throw new Error("Unsupported image size requested.");
  }

  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();

    try {
      const blob = await CoverIdApiClient.get(`/${coverId}-${size}.jpg`);

      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        resolve(base64data);
      };
    } catch (e) {
      reject(e);
    }
  });
}
