## Conventions (src/options)

Prefer `useEvent` over `useCallback` for callbacks passed to event listeners or effects where stable identity matters.

Prefer Jotai atoms over prop drilling when a value is needed across multiple components or more than one level deep.
