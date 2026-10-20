// This component serves as the home page, displaying the paper list and create form.

import { useEffect, useState } from "react";
import PaperForm from "../components/PaperForm";
import PaperList from "../components/PaperList";
import styles from "../styles/Home.module.css";
import type { Paper, PaperPayload, PapersListResponse } from "../types";

export default function Home() {
  // Home manages the papers state, which is updated after creating or deleting a paper.
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  /**
   * Message displayed after create/delete success or failure.
   * Required messages:
   * - "Paper created successfully"
   * - "Error creating paper"
   * - "Paper deleted successfully"
   * - "Error deleting paper"
   */
  const [message, setMessage] = useState<string | null>(null);

  // TODO: Fetch all papers on mount.
  //
  // Requirements:
  // - Endpoint: GET /api/papers
  // - Parse the response as PapersListResponse
  // - Store the returned papers in state
  // - On failure: show "Error loading papers"
  useEffect(() => {
    async function loadPapers() {
      try {
        // TODO: Fetch papers from GET /api/papers
        const response = await fetch("/api/papers");
        // TODO: If response is not ok, throw an Error
        if (!response.ok) throw new Error("Failed to load papers");
        // TODO: Parse JSON as PapersListResponse
        const data: PapersListResponse = await response.json();
        // TODO: Set papers state using data.papers
        setPapers(data.papers);
      } catch {
        // TODO: Set loadError to true
        setLoadError(true);
      } finally {
        // TODO: Set loading to false
        setLoading(false);
      }
    }

    loadPapers();
  }, []);

  // TODO: Implement paper creation.
  //
  // Requirements:
  // - Endpoint: POST /api/papers
  // - Send payload as JSON
  // - On success:
  //   - Parse the response as Paper
  //   - Add the created paper to the existing papers state
  //   - Show "Paper created successfully"
  //   - Return true so PaperForm resets
  // - On failure:
  //   - Show "Error creating paper"
  //   - Return false
  async function handleCreate(payload: PaperPayload): Promise<boolean> {
    // TODO: Clear previous message
    setMessage(null);

    try {
      // TODO: Send POST /api/papers
      //
      // Hint:
      // const response = await fetch("/api/papers", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(...),
      // });
      const response = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // TODO: If response is not ok, throw an Error
      if (!response.ok) throw new Error("Failed to create paper");
      // TODO: Parse response JSON as Paper
      const created: Paper = await response.json();
      // TODO: Add the created paper to papers state
      // Hint: Use setPapers with a state updater function
      setPapers((prev) => [...prev, created]);
      // TODO: Set message to "Paper created successfully"
      setMessage("Paper created successfully");
      // TODO: Return true
      return true;
    } catch {
      // TODO: Set message to "Error creating paper"
      setMessage("Error creating paper");
      // TODO: Return false
      return false;
    }
  }

  // TODO: Implement paper deletion.
  //
  // Requirements:
  // - Ask for confirmation before deleting
  // - If canceled, do nothing
  // - Endpoint: DELETE /api/papers/:id
  // - On success:
  //   - Remove the deleted paper from papers state
  //   - Show "Paper deleted successfully"
  // - On failure:
  //   - Show "Error deleting paper"
  async function handleDelete(paper: Paper) {
    // TODO: Ask for confirmation before deleting
    // Hint: Use confirm() with the following message:
    // `Are you sure you want to delete ${paper.title}?`
    // If the user cancels, return without deleting
    if (!confirm(`Are you sure you want to delete ${paper.title}?`)) return;

    // TODO: Clear previous message
    setMessage(null);

    try {
      // TODO: Send DELETE /api/papers/:id
      //
      // Hint:
      // const response = await fetch(`/api/papers/${paper.id}`, {
      //   method: "DELETE",
      // });
      const response = await fetch(`/api/papers/${paper.id}`, {
        method: "DELETE",
      });
      // TODO: If response is not ok, throw an Error
      if (!response.ok) throw new Error("Failed to delete paper");
      // TODO: Remove the deleted paper from papers state
      // Hint: Use setPapers with filter() to exclude paper.id
      setPapers((prev) => prev.filter((p) => p.id !== paper.id));
      // TODO: Set message to "Paper deleted successfully"
      setMessage("Paper deleted successfully");
    } catch {
      // TODO: Set message to "Error deleting paper"
      setMessage("Error deleting paper");
    }
  }

  return (
    <div /* TODO: Style with styles.container */ className={styles.container}>
      <h1 /* TODO: Style with styles.title */ className={styles.title}>Paper Management System</h1>

      {/* TODO: Render success/error message if present */}
      {message && <div>{/* TODO */}{message}</div>}

      <h2 /* TODO: Style with styles.sectionTitle */ className={styles.sectionTitle}>Create New Paper</h2>
      <PaperForm onSubmit={handleCreate} />

      <h2 /* TODO: Style with styles.sectionTitle */ className={styles.sectionTitle}>Papers</h2>

      {/* TODO: Show loading/error messages or the paper list */}
      {loading ? (
        <div>{/* TODO */}Loading papers...</div>
      ) : loadError ? (
        <div>{/* TODO */}Error loading papers</div>
      ) : (
        <PaperList papers={papers} onDelete={handleDelete} />
      )}
    </div>
  );
}