// ============================================================
// ECE1724 Assignment 3 - Sample Tests
// ============================================================
//
// These tests cover selected Assignment 3 requirements.
// Passing all sample tests does not guarantee full marks.
//
// Prerequisites:
// - Assignment 2 backend running at http://localhost:3000
// - Assignment 3 frontend running at http://localhost:5173
// - A disposable database, as tests will delete existing data
//
// Run the tests with --workers=1.

import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import type { Author, Paper, PapersListResponse } from "../src/types";

const FRONTEND_URL = "http://localhost:5173";
const BACKEND_URL = "http://localhost:3000";

// ============================================================
// Test Setup and Helper Functions
// ============================================================
test.use({ browserName: "chromium" });
test.beforeAll(async () => {
  if (test.info().config.workers !== 1)
    throw new Error(
      "Run these tests with --workers=1 against a disposable database.",
    );
  await getJSON<PapersListResponse>("/api/papers");
});
test.beforeEach(async () => {
  // Clear existing papers and authors before each test.
  for (const resource of ["papers", "authors"]) {
    while (true) {
      const response = await fetch(
        `${BACKEND_URL}/api/${resource}?limit=100&offset=0`,
      );
      if (!response.ok)
        throw new Error(`Cannot reset ${resource}: ${response.status}`);
      const data = (await response.json()) as Record<string, { id: number }[]>;
      const items = data[resource];
      if (items.length === 0) break;
      for (const item of items) {
        const deleted = await fetch(
          `${BACKEND_URL}/api/${resource}/${item.id}`,
          { method: "DELETE" },
        );
        if (!deleted.ok)
          throw new Error(`Cannot delete ${resource}/${item.id}`);
      }
    }
  }
});

async function getJSON<T>(path: string): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`);
  if (!response.ok) throw new Error(`GET ${path}: ${response.status}`);
  return (await response.json()) as T;
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok)
    throw new Error(
      `POST ${path}: ${response.status} ${await response.text()}`,
    );
  return (await response.json()) as T;
}

async function seedAuthors(): Promise<Author[]> {
  return [
    await postJSON<Author>("/api/authors", {
      name: "Ada",
      email: "ada@example.com",
      affiliation: "UofT",
    }),
    await postJSON<Author>("/api/authors", {
      name: "Grace",
      email: null,
      affiliation: null,
    }),
  ];
}

async function seedPaper(
  title = "Original Paper",
  authors?: Author[],
): Promise<Paper> {
  return postJSON<Paper>("/api/papers", {
    title,
    publishedIn: "ACM",
    year: 2026,
    authors: authors ?? (await seedAuthors()),
  });
}

function input(page: Page, name: string) {
  return page.locator(`input[name="${name}"]`);
}

function card(page: Page, title: string) {
  return page
    .getByRole("heading", { name: title, exact: true, level: 3 })
    .locator("..");
}

async function fillFields(
  page: Page,
  title = "New Paper",
  venue = "IEEE",
  year = "2027",
) {
  await input(page, "title").fill(title);
  await input(page, "publishedIn").fill(venue);
  await input(page, "year").fill(year);
}

async function expectMessage(page: Page, message: string) {
  await expect(page.getByText(message, { exact: true })).toBeVisible();
}
// Match API requests with or without query parameters.
function apiPattern(path: string) {
  return new RegExp(`${path}(?:\\?.*)?$`);
}
// Delay API responses to test loading states.
async function holdGET(page: Page, path: string) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(apiPattern(path), async (route) => {
    await gate;
    await route.continue();
  });
  return release;
}
// Track document identity to detect full-page reloads.
async function markDocument(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "assignmentDocumentId", {
      value: Math.random(),
    });
  });
}

async function documentId(page: Page) {
  return page.evaluate(
    () =>
      (window as Window & { assignmentDocumentId?: number })
        .assignmentDocumentId,
  );
}

// ============================================================
// Home Route (/): Paper List
// ============================================================
test("Displays the paper-list loading message", async ({ page }) => {
  const release = await holdGET(page, "/api/papers");
  try {
    await page.goto(FRONTEND_URL);
    await expectMessage(page, "Loading papers...");
  } finally {
    release();
  }
});

test("Displays two papers with their venues, years, and authors", async ({
  page,
}) => {
  const firstAuthors = await seedAuthors();
  const first = await seedPaper("First Paper", firstAuthors);
  const secondAuthors = [
    await postJSON<Author>("/api/authors", {
      name: "Barbara",
      email: null,
      affiliation: "MIT",
    }),
    await postJSON<Author>("/api/authors", {
      name: "Edsger",
      email: null,
      affiliation: null,
    }),
  ];
  const second = await seedPaper("Second Paper", secondAuthors);
  await page.goto(FRONTEND_URL);
  for (const paper of [first, second]) {
    const item = card(page, paper.title);
    await expect(item).toBeVisible();
    await expect(item).toContainText(
      `Published in ${paper.publishedIn}, ${paper.year}`,
    );
    await expect(item).toContainText(
      `Authors: ${paper.authors.map((a) => a.name).join(", ")}`,
    );
  }
});

test("Navigates to the edit page without reloading the document", async ({
  page,
}) => {
  const paper = await seedPaper();
  await markDocument(page);
  await page.goto(FRONTEND_URL);
  const identity = await documentId(page);
  await card(page, paper.title)
    .getByRole("button", { name: "Edit", exact: true })
    .or(
      card(page, paper.title).getByRole("link", { name: "Edit", exact: true }),
    )
    .click();
  await expect(page).toHaveURL(`${FRONTEND_URL}/edit/${paper.id}`);
  expect(await documentId(page)).toBe(identity);
});

// ============================================================
// Home Route (/): Paper Creation Form
// ============================================================
test("Renders empty creation inputs and fetched author choices", async ({
  page,
}) => {
  const authors = await seedAuthors();
  await page.goto(FRONTEND_URL);
  for (const [label, name] of [
    ["Title:", "title"],
    ["Published In:", "publishedIn"],
    ["Year:", "year"],
  ]) {
    await expect(page.getByLabel(label, { exact: true })).toBeVisible();
    await expect(input(page, name)).toHaveValue("");
  }
  const select = page.locator("select[multiple]");
  await expect(select).toBeEnabled();
  for (const author of authors)
    await expect(select.locator(`option[value="${author.id}"]`)).toHaveText(
      author.name,
    );
});

async function expectCreateValidation(
  page: Page,
  title: string,
  venue: string,
  year: string,
  message: string,
) {
  await seedAuthors();
  await page.goto(FRONTEND_URL);
  let writes = 0;
  page.on("request", (req) => {
    if (
      req.method() === "POST" &&
      new URL(req.url()).pathname === "/api/papers"
    )
      writes++;
  });
  await fillFields(page, title, venue, year);
  await page.getByRole("button", { name: "Create Paper", exact: true }).click();
  await expect(page.locator(".error")).toHaveText(message);
  expect(writes).toBe(0);
}

test("Validates an empty title before creating", async ({ page }) => {
  await expectCreateValidation(page, "", "", "", "Title is required");
});

test("Validates an empty publication year before creating", async ({
  page,
}) => {
  await expectCreateValidation(
    page,
    "New Paper",
    "IEEE",
    "",
    "Publication year is required",
  );
});

test("Requires an author selection before creating", async ({ page }) => {
  await seedAuthors();
  await page.goto(FRONTEND_URL);
  await expect(page.locator("select[multiple]")).toBeEnabled();
  await fillFields(page);
  await page.getByRole("button", { name: "Create Paper", exact: true }).click();
  await expect(page.locator(".error")).toHaveText(
    "Please select at least one author",
  );
});

async function createThroughForm(page: Page) {
  const authors = await seedAuthors();
  await markDocument(page);
  await page.goto(FRONTEND_URL);
  const identity = await documentId(page);
  await fillFields(page, "Created Paper", "IEEE", "2027");
  await page
    .locator("select[multiple]")
    .selectOption(authors.map((a) => String(a.id)));
  const requestPromise = page.waitForRequest(
    (req) =>
      req.method() === "POST" && new URL(req.url()).pathname === "/api/papers",
  );
  await page.getByRole("button", { name: "Create Paper", exact: true }).click();
  await requestPromise;
  return { authors, identity };
}

test("Shows a success message after creating a paper", async ({ page }) => {
  await createThroughForm(page);
  await expectMessage(page, "Paper created successfully");
});

test("Adds the created paper to the list without reloading", async ({
  page,
}) => {
  const { identity } = await createThroughForm(page);
  const item = card(page, "Created Paper");
  await expect(item).toBeVisible();
  await expect(item).toContainText("Published in IEEE, 2027");
  await expect(item).toContainText("Authors: Ada, Grace");
  expect(await documentId(page)).toBe(identity);
});

test("Resets creation inputs after a successful submission", async ({
  page,
}) => {
  await createThroughForm(page);
  await expectMessage(page, "Paper created successfully");
  for (const name of ["title", "publishedIn", "year"])
    await expect(input(page, name)).toHaveValue("");
  expect(
    await page
      .locator("select[multiple]")
      .evaluate((select: HTMLSelectElement) => select.selectedOptions.length),
  ).toBe(0);
});

// ============================================================
// Home Route (/): Paper Deletion
// ============================================================
async function deleteThroughUI(page: Page, paper: Paper, accept: boolean) {
  const dialogPromise = page.waitForEvent("dialog");
  const clickPromise = card(page, paper.title)
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  const dialog = await dialogPromise;
  expect(dialog.type()).toBe("confirm");
  expect(dialog.message()).toBe(
    `Are you sure you want to delete ${paper.title}?`,
  );
  if (accept) await dialog.accept();
  else await dialog.dismiss();
  await clickPromise;
}

test("Asks for confirmation and deletes a paper from the list", async ({
  page,
}) => {
  const authors = await seedAuthors();
  const paper = await seedPaper("Delete This Paper", authors);
  await seedPaper("Keep This Paper", authors);
  await page.goto(FRONTEND_URL);
  await deleteThroughUI(page, paper, true);
  await expect(card(page, paper.title)).toHaveCount(0);
  await expect(card(page, "Keep This Paper")).toBeVisible();
  await expectMessage(page, "Paper deleted successfully");
});

// ============================================================
// Edit Route (/edit/:id): Paper Details
// ============================================================
test("Loads an existing paper with pre-filled fields and read-only authors", async ({
  page,
}) => {
  const paper = await seedPaper();
  await page.goto(`${FRONTEND_URL}/edit/${paper.id}`);
  await expect(
    page.getByRole("heading", { name: "Edit Paper", exact: true }),
  ).toBeVisible();
  for (const name of ["title", "publishedIn", "year"] as const)
    await expect(input(page, name)).toHaveValue(String(paper[name]));
  const form = page.locator("form");
  await expect(
    form.getByText(paper.authors.map((a) => a.name).join(", "), {
      exact: true,
    }),
  ).toBeVisible();
  await expect(form.getByText(/read-only/i)).toBeVisible();
});

// ============================================================
// Edit Route (/edit/:id): Form Validation
// ============================================================
async function expectEditValidation(
  page: Page,
  title: string,
  venue: string,
  year: string,
  message: string,
) {
  const paper = await seedPaper();
  await page.goto(`${FRONTEND_URL}/edit/${paper.id}`);
  let updates = 0;
  page.on("request", (req) => {
    if (req.method() === "PUT") updates++;
  });
  await fillFields(page, title, venue, year);
  await page.getByRole("button", { name: "Update Paper", exact: true }).click();
  await expect(page.locator(".error")).toHaveText(message);
  expect(updates).toBe(0);
}

test("Validates an empty title before updating", async ({ page }) => {
  await expectEditValidation(page, "", "", "", "Title is required");
});

test("Validates an empty year before updating", async ({ page }) => {
  await expectEditValidation(
    page,
    "Edited Paper",
    "IEEE",
    "",
    "Publication year is required",
  );
});

// ============================================================
// Edit Route (/edit/:id): Paper Update
// ============================================================
test("Updates an existing paper and shows a success message", async ({
  page,
}) => {
  const paper = await seedPaper();
  await page.goto(`${FRONTEND_URL}/edit/${paper.id}`);
  await fillFields(page, "Updated Paper", "IEEE", "2027");
  await page.getByRole("button", { name: "Update Paper", exact: true }).click();
  await expectMessage(page, "Paper updated successfully");
  await expect
    .poll(() => getJSON<Paper>(`/api/papers/${paper.id}`).then((p) => p.title))
    .toBe("Updated Paper");
});

test("Navigates home after updating a paper", async ({ page }) => {
  const paper = await seedPaper();
  await markDocument(page);
  await page.goto(`${FRONTEND_URL}/edit/${paper.id}`);
  const identity = await documentId(page);
  await fillFields(page, "Updated Paper", "IEEE", "2027");
  await page.getByRole("button", { name: "Update Paper", exact: true }).click();
  await expectMessage(page, "Paper updated successfully");
  await expect(page).toHaveURL(`${FRONTEND_URL}/`, { timeout: 6000 });
  await expect(card(page, "Updated Paper")).toBeVisible();
  expect(await documentId(page)).toBe(identity);
});

test("Cancel returns to the home page", async ({ page }) => {
  const paper = await seedPaper();
  await page.goto(`${FRONTEND_URL}/edit/${paper.id}`);
  await fillFields(page, "Unsaved Paper", "IEEE", "2027");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(`${FRONTEND_URL}/`);
});
