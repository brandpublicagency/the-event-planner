

## Problem

The category selector is currently placed inside the `secondaryAction` slot of the `Header` component, which renders everything with `ml-auto` on the right side. This causes the category label (e.g., "Marketing & Advertising") to overlap with the action icons (Save, Print, Export, Delete) since they're all competing for right-side space.

## Solution

Move the `CategorySelector` out of the `secondaryAction` slot and into the `children` slot of the `Header`, placing it next to the "← Library" button on the left side. This naturally separates the category from the action buttons and eliminates the overlap.

## Changes

**`src/components/documents/DocumentEditor.tsx`** (single file change):

1. Move `CategorySelector` from inside the `secondaryAction` div (lines 241-247) into the `children` section (lines 266-271), placing it after the "← Library" button.

2. The `secondaryAction` will only contain `SaveButton` and `DocumentActions`.

3. The `children` block becomes:
```tsx
<div className="flex items-center gap-2">
  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground h-9" onClick={() => navigate("/documents")}>
    <ArrowLeft className="h-4 w-4" />
    Library
  </Button>
  <CategorySelector
    selectedCategory={selectedCategoryId}
    onChange={(categoryId) => document.id && handleUpdateCategories(categoryId)}
    placeholder="Category"
  />
</div>
```

This gives a clean layout: `[← Library] [Category ▾]` on the left, `[Save] [🖨] [⬇] [🗑]` on the right with natural spacing.

