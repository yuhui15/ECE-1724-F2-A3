// This component handles editing an existing paper.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PaperForm from "../components/PaperForm";
import type { Paper, PaperPayload } from "../types";

export default function EditPaper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  /**
   * Message displayed after update success/failure.
   * Required:
   * - "Paper updated successfully"
   * - "Error updating paper"
   */
  const [message, setMessage] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);

  // TODO: Fetch paper details on mount and when id changes.
  //
  // Requirements:
  // - Endpoint: GET /api/papers/:id
  // - If 404: show "Paper not found"
  // - If other failure: show "Error loading paper"
  useEffect(() => {
    async function loadPaper() {
      try {
        // TODO: Fetch paper details from GET /api/papers/:id
        // TODO: If status === 404, return without setting paper
        // TODO: If response is not ok, throw an Error
        // TODO: Parse the response as Paper and setPaper(...)
      } catch {
        // TODO: Set loadError to true
      } finally {
        // TODO: Set loading to false
      }
    }

    loadPaper();
  }, [id]);

  // TODO: Navigate to "/" 3 seconds after a successful update.
  //
  // Requirements:
  // - Start the timer only when updated is true
  // - Navigate to "/" after 3000 milliseconds
  // - Clean up the timer when the effect is cleaned up
  //
  // Hint:
  // - window.setTimeout(callback, delay) schedules a callback after a delay (ms)
  //   and returns a timer ID.
  // - window.clearTimeout(timerId) cancels the scheduled callback.
  useEffect(() => {
    if (!updated) return;

    // TODO: Set a timeout to navigate("/") after 3000 ms
    // TODO: Return a cleanup function that clears the timeout
  }, [updated, navigate]);

  // TODO: Implement update behavior.
  //
  // Requirements:
  // - Endpoint: PUT /api/papers/:id
  // - Send the update payload as JSON
  // - Authors are NOT editable:
  //   - The dropdown is still rendered and selectable in the UI
  //   - BUT the PUT request must preserve the original authors
  //     from the fetched paper
  //
  // - On success:
  //   - Show "Paper updated successfully"
  //   - Set updated to true to lock the form and trigger navigation
  //   - Return true
  // - On failure:
  //   - Show "Error updating paper"
  //   - Return false
  //
  // - Do not submit if paper is missing or already updated
  async function handleUpdate(payload: PaperPayload): Promise<boolean> {
    if (!paper || updated) return false;

    // TODO: Clear the previous message

    try {
      // TODO: Send PUT /api/papers/:id
      //
      // Requirements:
      // - Include all fields from payload
      // - Override authors with the ORIGINAL paper.authors
      // - Map each original author to { name, email, affiliation }
      //
      // Hint:
      // const response = await fetch(`/api/papers/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(...),
      // });
      // TODO: If response is not ok, throw an Error
      // TODO: Set message to "Paper updated successfully"
      // TODO: Set updated to true
      // TODO: Return true
    } catch {
      // TODO: Set message to "Error updating paper"
      // TODO: Return false
    }
  }

  if (loading) return <div>{/* TODO */}</div>;
  if (loadError) return <div>{/* TODO */}</div>;
  if (!paper) return <div>{/* TODO */}</div>;

  return (
    <div>
      <h1>Edit Paper</h1>

      <PaperForm
        key={paper.id}
        paper={paper}
        locked={updated}
        onSubmit={handleUpdate}
      />

      {/* TODO: Show message in the DOM */}
      {message && <div>{/* TODO */}</div>}
    </div>
  );
}
