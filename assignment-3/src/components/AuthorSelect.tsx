// This component renders a multi-select dropdown for choosing authors.

import type { Author } from "../types";

type AuthorSelectProps = {
  authors: Author[];
  loading: boolean;
  error: boolean;
  selectedAuthorIds: number[];
  onChange: (ids: number[]) => void;
};

export default function AuthorSelect({
  authors,
  loading,
  error,
  selectedAuthorIds,
  onChange,
}: AuthorSelectProps) {
  return (
    <div>
      {/* TODO: Render "Error loading authors" above the dropdown if error is true */}
      {error && <div className="error">{/* TODO */}</div>}

      <select
        multiple
        /**
         * Note: In the DOM, <select> option values are strings.
         * Converting IDs to strings keeps React controlled properly.
         */
        value={selectedAuthorIds.map(String)}
        // TODO: Disable dropdown during loading or error
        disabled={/* TODO */}
        // TODO: When the user selects/deselects authors, call onChange([...ids]).
        // Hint: event.target.selectedOptions gives all currently-selected <option>s.
        // Use Array.from() to convert selected option values (strings) into numbers.
        onChange={(event) => {
          // TODO
        }}
      >
        {/* TODO:
            - If not loading, no error, and authors is empty, render:
              <option disabled>No authors available</option>
            - Otherwise, render one <option> per author
              (key = author.id, value = author.id, text = author.name)
        */}
      </select>
    </div>
  );
}
