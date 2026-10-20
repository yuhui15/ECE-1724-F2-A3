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
        const response = await fetch("/api/authors");
        // TODO: If response is not ok, throw an Error
        if (!response.ok) throw new Error("Failed to load authors");
        // TODO: Parse JSON as AuthorsListResponse
        const data: AuthorsListResponse = await response.json();
        // TODO: Set authors state using data.authors
        setAuthors(data.authors);
      } catch {
        // TODO: Set authorError to true
        setAuthorError(true);
      } finally {
        // TODO: Set loadingAuthors to false
        setLoadingAuthors(false);
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
    event.preventDefault();

    // Do not submit while submitting or locked.
    if (submitting || locked) return;

    let validationError: string | null = null;

    // TODO: Implement validation in the required order.
    // Set validationError to the first applicable error message.
    const year = Number(form.year);
    if (form.title.trim() === "") {
      validationError = "Title is required";
    } else if (form.publishedIn.trim() === "") {
      validationError = "Publication venue is required";
    } else if (form.year.trim() === "") {
      validationError = "Publication year is required";
    } else if (!Number.isInteger(year) || year <= 1900) {
      validationError = "Valid year after 1900 is required";
    } else if (!paper && form.authorIds.length === 0) {
      validationError = "Please select at least one author";
    }

    // TODO: Set error state to validationError
    setError(validationError);
    if (validationError) return;

    // TODO: Determine which authors to submit.
    //
    // Requirements:
    // - Edit mode: use paper.authors
    // - Create mode: select authors whose IDs are in form.authorIds
    //
    // Hint: Use filter() and includes() in create mode.
    const selectedAuthors: Author[] = paper
      ? paper.authors
      : authors.filter((author) => form.authorIds.includes(author.id));

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
      authors: selectedAuthors.map(({ name, email, affiliation }) => ({
        name,
        email,
        affiliation,
      })), // TODO: Replace with mapped authors
    };

    // TODO: Set submitting to true
    setSubmitting(true);

    try {
      // TODO: Call onSubmit(payload) and await its boolean result
      const success = await onSubmit(payload);
      // TODO: If successful and in create mode, reset form to emptyForm
      if (success && !paper) {
        setForm(emptyForm);
      }
    } finally {
      // TODO: Set submitting to false
      setSubmitting(false);
    }
  }

  const disabled = submitting || locked;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      /* TODO: Style with styles.form */
      className={styles.form}
    >
      {/* TODO: Render validation error if present */}
      {error && <div className="error">{/* TODO */}{error}</div>}

      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={/* TODO */ form.title}
          disabled={/* TODO */ disabled}
          onChange={(event) => {
            // TODO: Update form.title using setForm
            setForm((prev) => ({ ...prev, title: event.target.value }));
          }}
        />
      </div>

      <div>
        <label htmlFor="publishedIn">Published In:</label>
        <input
          id="publishedIn"
          name="publishedIn"
          type="text"
          value={/* TODO */ form.publishedIn}
          disabled={/* TODO */ disabled}
          onChange={(event) => {
            // TODO: Update form.publishedIn using setForm
            setForm((prev) => ({ ...prev, publishedIn: event.target.value }));
          }}
        />
      </div>

      <div>
        <label htmlFor="year">Year:</label>
        <input
          id="year"
          name="year"
          type="number"
          value={/* TODO */ form.year}
          disabled={/* TODO */ disabled}
          onChange={(event) => {
            // TODO: Update form.year using setForm
            // Note: Keep the input value as a string.
            setForm((prev) => ({ ...prev, year: event.target.value }));
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
            {paper.authors.map((author) => author.name).join(", ")}
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
              setForm((prev) => ({ ...prev, authorIds }));
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
          <button type="button" onClick={/* TODO */ () => navigate("/")}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}