// This component renders a form for creating or editing a paper.

import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "../styles/PaperForm.module.css";
import type {
  Author,
  AuthorsListResponse,
  Paper,
  PaperFormData,
  PaperPayload,
} from "../types";
import AuthorSelect from "./AuthorSelect";

type PaperFormProps = {
  paper?: Paper; // undefined in create mode
  locked?: boolean;
  onSubmit: (payload: PaperPayload) => Promise<boolean>;
};

const emptyForm: PaperFormData = {
  title: "",
  publishedIn: "",
  year: "",
  authorIds: [],
};

export default function PaperForm({
  paper,
  locked = false,
  onSubmit,
}: PaperFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<PaperFormData>(
    paper
      ? {
          title: paper.title,
          publishedIn: paper.publishedIn,
          year: String(paper.year),
          authorIds: [],
        }
      : emptyForm,
  );

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(!paper);
  const [authorError, setAuthorError] = useState(false);

  /**
   * Store a validation error message.
   * Show ONLY the first error encountered.
   */
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // TODO: Fetch authors from the API in create mode only.
  //
  // Requirements:
  // - Endpoint: GET /api/authors
  // - Skip fetching in edit mode (when paper is provided)
  // - Parse the response as AuthorsListResponse
  // - Store the returned authors in state
  // - On failure: set authorError to true
  useEffect(() => {
    if (paper) return;

    async function loadAuthors() {
      try {
        // TODO: fetch("/api/authors")
        // TODO: If response is not ok, throw an Error
        // TODO: Parse JSON as AuthorsListResponse
        // TODO: Set authors state using data.authors
      } catch {
        // TODO: Set authorError to true
      } finally {
        // TODO: Set loadingAuthors to false
      }
    }

    loadAuthors();
  }, [paper]);

  /**
   * TODO:
   * Implement form submission and validation.
   *
   * Validation must follow this EXACT order:
   * 1. Title is required
   * 2. Publication venue is required
   * 3. Publication year is required
   * 4. Valid year after 1900 is required
   * 5. Please select at least one author (create mode only)
   *
   * Important:
   * - Show ONLY the first validation error.
   * - In edit mode, skip author validation.
   * - Call onSubmit(payload) only if validation passes.
   */
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // TODO: Prevent page reload

    // Do not submit while submitting or locked.
    if (submitting || locked) return;

    let validationError: string | null = null;

    // TODO: Implement validation in the required order.
    // Set validationError to the first applicable error message.

    // TODO: Set error state to validationError
    if (validationError) return;

    // TODO: Determine which authors to submit.
    //
    // Requirements:
    // - Edit mode: use paper.authors
    // - Create mode: select authors whose IDs are in form.authorIds
    //
    // Hint: Use filter() and includes() in create mode.

    // TODO: Construct PaperPayload.
    //
    // Requirements:
    // - title and publishedIn come from form
    // - year uses the numeric value
    // - authors must contain only { name, email, affiliation }
    //   for each selected author
    const payload: PaperPayload = {
      title: form.title,
      publishedIn: form.publishedIn,
      year,
      authors: [], // TODO: Replace with mapped authors
    };

    // TODO: Set submitting to true

    try {
      // TODO: Call onSubmit(payload) and await its boolean result
      // TODO: If successful and in create mode, reset form to emptyForm
    } finally {
      // TODO: Set submitting to false
    }
  }

  const disabled = submitting || locked;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      /* TODO: Style with styles.form */
    >
      {/* TODO: Render validation error if present */}
      {error && <div className="error">{/* TODO */}</div>}

      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={/* TODO */}
          disabled={/* TODO */}
          onChange={(event) => {
            // TODO: Update form.title using setForm
          }}
        />
      </div>

      <div>
        <label htmlFor="publishedIn">Published In:</label>
        <input
          id="publishedIn"
          name="publishedIn"
          type="text"
          value={/* TODO */}
          disabled={/* TODO */}
          onChange={(event) => {
            // TODO: Update form.publishedIn using setForm
          }}
        />
      </div>

      <div>
        <label htmlFor="year">Year:</label>
        <input
          id="year"
          name="year"
          type="number"
          value={/* TODO */}
          disabled={/* TODO */}
          onChange={(event) => {
            // TODO: Update form.year using setForm
            // Note: Keep the input value as a string.
          }}
        />
      </div>

      {paper ? (
        // Edit mode: display original authors as read-only text.
        <div>
          <p className={styles.readOnlyLabel}>Authors (read-only):</p>
          <p className={styles.readOnlyText}>
            {/* TODO: Display paper authors' names, separated by ", " */}
            {/* Hint: Use map() and join() */}
          </p>
        </div>
      ) : (
        // Create mode: allow selecting authors.
        <fieldset disabled={disabled}>
          <legend>Authors:</legend>
          <AuthorSelect
            authors={authors}
            loading={loadingAuthors}
            error={authorError}
            selectedAuthorIds={form.authorIds}
            onChange={(authorIds) => {
              // TODO: Update form.authorIds using setForm
            }}
          />
        </fieldset>
      )}

      <div>
        <button type="submit" disabled={disabled}>
          {paper ? "Update Paper" : "Create Paper"}
        </button>

        {/* TODO:
            In edit mode only:
            - Render a Cancel button
            - Clicking it should navigate back to "/"
        */}
        {paper && (
          <button type="button" onClick={/* TODO */}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
