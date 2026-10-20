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
  const navigate = useNavigate();

  // TODO: If papers is empty, render "No papers found"
  if (papers.length === 0) {
    return <div className={styles.container}>No papers found</div>;
  }

  return (
    <div /* TODO: Style with styles.container */ className={styles.container}>
      {/* TODO: Render one entry per paper using map() */}
      {papers.map((paper) => (
        <div
          key={paper.id}
          /* TODO: Style with styles.paper */
          className={styles.paper}
        >
          <h3 /* TODO: Style with styles.paperTitle */ className={styles.paperTitle}>
            {/* TODO: Display paper title */}
            {paper.title}
          </h3>

          <p>
            {/* TODO: Display "Published in <venue>, <year>" */}
            Published in {paper.publishedIn}, {paper.year}
          </p>

          <p>
            {/* TODO: Display author names separated by ", " */}
            {/* Hint: Use map() and join() */}
            Authors: {paper.authors.map((author) => author.name).join(", ")}
          </p>

          <button
            type="button"
            onClick={() => {
              // TODO: Navigate to /edit/:id for this paper
              navigate(`/edit/${paper.id}`);
            }}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              // TODO: Call onDelete with this paper
              onDelete(paper);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}