# Refactor

Check out the [`01-intro.md`](./01-intro.md) file for an overview of the project.

The project has grown and we have too much code in few files and an inconsistency in how the ui components are structured. Thus, a refactor is needed.

## Implementations

- Move all general UI components from `src/app/_components/ui` to `src/components/ui`.
- Move the todos-list component into multiple files and put all of them into a folder with the same name: `src/app/_components/todos-list`.
- Do NOT change anything about the code itself, just move big chunks around and fix any imports.
- Try to split into logical components. Don't just do splits to put less code in a file, but rather to create components that are reusable and make sense on their own. A component should manage its own state and not rely on the parent or on any sibling components.
