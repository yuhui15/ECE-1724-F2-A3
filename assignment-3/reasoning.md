## Q1: Before implementation, how do you plan to approach one core part of this assignment?
 
Choose one concrete part of the assignment.
 
Briefly describe your planned approach, a technical concern,
or an uncertainty you expect to work through.


I'll keep the papers in Home and pass stuff down to the child components through props.

| Component | Responsibility |
| :--- | :--- |
| **`Home`** | `fetch("/api/papers", { method: "POST" })`, then `setPapers((prev) => [...prev, created])` |
| **`PaperForm`** | Validate in order, then map `form.authorIds` to `{ name, email, affiliation }` with `authors.filter(...)` |
| **`AuthorSelect`** | `Array.from(event.target.selectedOptions, (o) => Number(o.value))`, then `onChange(ids)` |


## Q2: Did you use AI?
 
- If YES:
  - Briefly describe the meaningful ways you used AI.
  - This may include conceptual questions, debugging assistance,
    or help with small parts of the implementation.
  - If AI directly influenced your code, identify the relevant
    file, component, function, or configuration where practical.
 
- If NO:
  - Write "No AI used."


- Yes. I used AI to break down the assignment's tasks and understand the project's file architecture. AI identified which files I needed to complete (`src/main.tsx`, `src/routes/Home.tsx`, `src/routes/EditPaper.tsx`, `src/components/PaperList.tsx`, `src/components/PaperForm.tsx`, and `src/components/AuthorSelect.tsx`).


## Q3: (Only if you used AI)
 
Choose one specific AI interaction that meaningfully influenced your work.
 
Briefly explain:
 
- What the AI suggested, explained, or helped identify
- What you did with that input
- How you verified, modified, or rejected it


- **What the AI suggested:** When my tests failed with "TypeError: fetch failed", AI explained that the Assignment 2 backend was not running.
- **What I did with that input:** I ran `npm start` in my Assignment 2 folder.
- **How I verified:** I ran the tests again.