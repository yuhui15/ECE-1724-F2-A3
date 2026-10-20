// This component renders the paper list.
// Home owns list state and API requests; this component receives data and callbacks.

import { useNavigate } from "react-router";
import styles from "../styles/PaperList.module.css";
import type { Paper } from "../types";

type PaperListProps = {
  papers: Paper[];
  onDelete: (paper: Paper) => Promise<void>;
};

export default function PaperList({ papers, onDelete }: PaperListProps) {
  // TODO: If papers is empty, render "No papers found"

  return (
    <div /* TODO: Style with styles.container */>
      {/* TODO: Render one entry per paper using map() */}
      {papers.map((paper) => (
        <div
          key={paper.id}
          /* TODO: Style with styles.paper */
        >
          <h3 /* TODO: Style with styles.paperTitle */>
            {/* TODO: Display paper title */}
          </h3>

          <p>{/* TODO: Display "Published in <venue>, <year>" */}</p>

          <p>
            {/* TODO: Display author names separated by ", " */}
            {/* Hint: Use map() and join() */}
          </p>

          <button
            type="button"
            onClick={() => {
              // TODO: Navigate to /edit/:id for this paper
            }}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              // TODO: Call onDelete with this paper
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
