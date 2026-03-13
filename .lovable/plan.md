

## Plan: Document Library View

### Current Behavior
`/documents` immediately shows the sidebar + editor split view.

### New Behavior
1. `/documents` shows a **library page** — a grid/list of all documents with search, category filter, and a "New Document" button. Reuses the same data hook (`useDocumentsData`).
2. Clicking a document navigates to `/documents/:id`, which shows the **full editor experience** (current sidebar + editor layout via `DocumentsContainer`).
3. A back button in the editor view returns to the library.

### Route Changes (`AppRoutes.tsx`)
- `/documents` → `Documents` (library view)
- `/documents/:id` → new `DocumentDetail` page (current `DocumentsContainer` with pre-selected doc)

### New Component: `DocumentLibrary.tsx`
- Header with page title, search input, and "New Document" button
- Grid of document cards showing title, date, category badge
- Click navigates to `/documents/:id`
- Creating a new document navigates to `/documents/:newDocId` after creation

### Updated `Documents.tsx`
- Renders `DocumentLibrary` instead of `DocumentsContainer`
- Handles `?newDocument=true` by creating a doc and redirecting to `/documents/:id`

### New Page: `DocumentDetail.tsx`
- Reads `:id` from URL params
- Renders `DocumentsContainer` with the document pre-selected
- Includes a back/breadcrumb link to `/documents`

### Changes to `DocumentsContainer.tsx`
- Accept optional `initialDocId` prop to pre-select a document from the URL
- Use it in `useDocumentSelection` initialization

### Changes to `useDocumentSelection.ts`
- Support an `initialDocId` that takes priority over auto-selection logic

