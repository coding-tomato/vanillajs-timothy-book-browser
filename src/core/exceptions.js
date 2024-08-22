export class QueryStoreError extends Error {
  constructor(message) {
    super(message);
    this.name = "QueryStoreError";
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
