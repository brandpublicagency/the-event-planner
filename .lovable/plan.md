

## Problem

The toast close button has a dark background (sonner's default styling) creating a visible dark corner on the toast. The current CSS in `toast.css` only overrides the text `color` of the close button but not its `background`.

## Solution

Add `background: transparent` and `border: none` to the close button styles in `src/toast.css` to remove the dark background.

## Changes

**`src/toast.css`** — Update the close button styles (lines 85-88):

```css
[data-sonner-toast] [data-close-button] {
  color: rgba(0, 0, 0, 0.4) !important;
  background: transparent !important;
  border: none !important;
  transition: color 0.2s !important;
}
```

Single file, minimal change.

