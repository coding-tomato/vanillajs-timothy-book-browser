import { ApiError } from "./exceptions";

const types = ["json", "blob"];

class ApiService {
  constructor(baseUrl, type) {
    if (!types.includes(type)) {
      throw new Error(`Type ${type} not included in types ${types.join(",")}`);
    }

    this.baseUrl = baseUrl;
    this.type = type;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions = {};
    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      if (this.type === "json") {
        return await response.json();
      } else if (this.type === "blob") {
        return await response.blob();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError("Network error", 0);
      }
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: "GET" });
  }
}

export const SearchApiClient = new ApiService(
  "https://openlibrary.org",
  "json"
);
export const CoverIdApiClient = new ApiService(
  "https://covers.openlibrary.org/b/id",
  "blob"
);
