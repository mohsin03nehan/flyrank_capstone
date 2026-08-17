# NOTES.md — Comparing hand-built components to shadcn/ui

This project contains three hand-built accessible components in `src/playground/` (Modal, Tabs, Disclosure), built from scratch against the W3C ARIA Authoring Practices patterns with no component libraries. After building them, I installed shadcn/ui's `dialog` and `tabs` components (`src/components/ui/Dialog.tsx` and `Tabs.tsx`, built on Radix UI primitives) to compare against my own implementation.

## Gap 1: Focus trap and dismiss logic is delegated to a battle-tested primitive, not hand-rolled

My `Modal.tsx` manually implements the focus trap: querying all focusable elements inside the dialog with a CSS selector list, tracking Tab/Shift+Tab keydown events, and manually cycling focus between the first and last focusable elements. This works, but it's fragile — the focusable-elements selector list has to be maintained by hand, and edge cases (elements that become focusable/unfocusable dynamically, elements inside iframes, `contenteditable` regions, etc.) aren't fully covered.

shadcn's `Dialog` doesn't implement any of this itself — it wraps `@radix-ui/react-dialog`'s `Root`/`Content`/`Overlay` primitives, which handle focus trapping, focus restoration, `aria-hidden` on background content, and Escape/outside-click dismissal internally, using a `FocusScope` and `Portal` implementation that's been hardened against real-world accessibility edge cases over years of use. My version handles the common case correctly (verified by keyboard testing) but shadcn's version is more robust for cases I didn't think to test.

## Gap 2: Content is rendered in a Portal, not inline in the DOM tree

My `Modal.tsx` renders the dialog markup directly inside the component tree, wherever `<Modal>` is placed in JSX. shadcn's `DialogContent` wraps everything in `DialogPrimitive.Portal`, which renders the dialog's DOM nodes at the end of `document.body`, outside the normal component hierarchy.

This matters for two reasons I hadn't considered: it avoids z-index/overflow/`stacking-context` issues if the modal is opened from inside a container with `overflow: hidden` or a lower z-index than something else on the page, and it keeps the dialog outside any parent's CSS that might unintentionally affect it (transforms, filters, etc. on an ancestor). My implementation would break in exactly that scenario — a modal triggered from inside a card component with `overflow: hidden` would get visually clipped.

## Gap 3: Animation and open/close state transitions via data attributes

shadcn's components use `data-[state=open]` / `data-[state=closed]` attribute selectors (driven by Radix's internal state machine) to animate the dialog and overlay in and out smoothly, rather than an abrupt show/hide. My `Modal.tsx` just conditionally renders (`if (!isOpen) return null`), so it appears and disappears instantly with no transition. This is a UX polish gap, not a strict accessibility failure, but it's a detail I hadn't thought to include, and it also means the DOM node is completely unmounted immediately on close rather than animating out — which could interact awkwardly with focus-return timing in edge cases.

## Gap 4: Screen-reader-only labeling conventions

shadcn's `DialogPrimitive.Close` button includes a visually hidden `<span className="sr-only">Close</span>` alongside an icon-only `X` button, ensuring screen reader users get a meaningful label even though sighted users just see an icon. My Modal's close button (in the demo) uses visible text ("Close"), so this particular gap didn't surface in my implementation — but it's a pattern worth noting: any icon-only interactive element needs an accessible name via visually-hidden text or `aria-label`, and it's easy to forget when an icon "obviously" conveys meaning to a sighted developer.

## What I got right, comparatively

- ARIA roles, `aria-modal`, `aria-labelledby`, `aria-expanded`, `aria-controls`, `aria-selected` are all correctly applied in my versions and match what Radix's primitives ultimately render.
- My Tabs roving-tabindex implementation (`tabIndex={0}` on the active tab, `-1` on inactive tabs, with arrow-key navigation and automatic activation) is functionally equivalent to how Radix's `Tabs` primitive behaves — I tested both keyboard patterns side by side and they match.
- My Disclosure component is essentially identical in approach to what a from-scratch disclosure needs to be (native `<button>`, `aria-expanded`, `hidden` attribute) — this is the one pattern simple enough that a library adds little beyond convenience, since shadcn doesn't even ship a dedicated "Disclosure" component (the closest equivalent, `Collapsible`, follows the same pattern I used).

## Summary

The core accessibility semantics (roles, ARIA attributes, keyboard operability) in my hand-built components are correct and match the ARIA APG patterns. Where shadcn/ui pulls ahead is in the surrounding robustness layer: Portal rendering to avoid CSS/stacking issues, a more battle-tested focus-trap implementation via Radix's `FocusScope`, animated state transitions tied to a proper state machine, and accessible-naming conventions for icon-only controls. Building these by hand first made it much clearer *why* those details matter, rather than just trusting a library to "handle accessibility" as a black box.
