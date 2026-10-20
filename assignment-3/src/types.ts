/**
 * Assignment 3 Types
 *
 * Keep your types practical:
 * - Describe the data used by the frontend.
 * - Use separate types for API data, form state, and request payloads.
 *
 * You may add additional types if needed, but avoid over-engineering.
 */

// =====================
// API entities
// =====================

// The frontend only needs these fields; extra JSON fields are fine.
export type Author = {
  id: number;
  name: string;
  email: string | null;
  affiliation: string | null;
};

export type Paper = {
  /**
   * TODO:
   * Define the Paper type based on the JSON returned
   * by GET /api/papers and GET /api/papers/:id.
   *
   * Include only the fields needed by the frontend.
   */
};

// =====================
// API list responses
// =====================

export type PapersListResponse = {
  papers: Paper[];
  total: number;
  limit: number;
  offset: number;
};

export type AuthorsListResponse = {
  /**
   * TODO:
   * Define the response type for GET /api/authors.
   *
   * Hint: Follow the structure of PapersListResponse.
   */
};

// =====================
// Frontend form state
// =====================

// HTML input values are strings. Keep year as a string to allow an empty
// field while editing; convert it to a number on submission.
export type PaperFormData = {
  title: string;
  publishedIn: string;
  year: string;
  authorIds: number[];
};

// =====================
// API request payload
// =====================

// Assignment 2 matches existing authors by name, email, and affiliation.
export type AuthorInput = Pick<Author, "name" | "email" | "affiliation">;

export type PaperPayload = {
  title: string;
  publishedIn: string;
  year: number;
  authors: AuthorInput[];
};
