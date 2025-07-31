# User Management

Please refer to [`specifications/01-intro.md`](01-intro.md) to know what this project is about and to understand the contraints on the system.

Currently, all users see the same todo list and this is not useful. The user's ID is already stored in the database, so please only show the todos of the currently signed-in user.

Furthermore, todos should be paginated and there should be a "Done todos" section.

## Implementation

- Use Clerk to manage user authentication.
- If a user is not signed in, just show a simple message like "Please sign to view todos".
- If a user is signed in, show their todos.
- Make sure todos are sorted in the backend and in the frontend by the `createdAt` field in descending order (newest first).
- Use tRPC
- Add an additional "Done todos" section that shows all todos that are marked as done. This section is hidden by default and cana be expanded by the user. Show an according animation. If you deem necessary, add a component with that accordion-like behavior to the `src/app/_components/ui` folder. If you do so, please ONLY manage as much state as ABSOLUTELY NEEDED in the component and let the parent handle all the actual business logic things and hand the state over to the component via props.
- When a todo is marked as done in the active todos section, show a slide-out animation from left to right to indicate the todo is "going away" before it moves to the done section.
- Use `npx shadcn@latest add` to install a Pagination component and style it according to the design as per [`specifications/02-optimistic-updates.md`](02-optimistic-updates.md). Do NOT use a theme provider, just style the component directly.
- Make sure to then paginate the page and use a page size of 10 todos per page.
- Hidden todos should only be shown if the user expands them. Always show the last 10 todos and provide an option to load 10 more todos (the button should just say "Load more" and NOT specify the count).
- This means that hidden todos should be fetched separately (using tRPC). Please make sure to prefetch the first 10 hidden todos for better user experience.
- Add the necessary private procedures to the tRPC todos router.
- Edit all todos procedures to check if the user doing the action is the owner of the todo. If not, throw a tRPC authorization error. The frontend does not need need to handle authorization errors.

## Post-Implementation

- When the implementation is done, `npm build` should be ran to check if everything compiles succesfully.
- Please add between 30 and 40 testing todos for all users currently in the database. For that, just create a script in the top-level `scripts` folder that creates the todos. That script should be a simple node script that accesses the [`db.sqlite`](../db.sqlite) database directly and should not use any NextJS functionality what so ever.
