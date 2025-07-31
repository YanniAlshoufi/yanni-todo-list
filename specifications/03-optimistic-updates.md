# Optimistic Updates

Check out the [`01-intro.md`](./01-intro.md) file for an overview of the project.

Customers have complained a lot about the buttons not doing things for a couple of seconds after they are clicked. The reason for this is that the app is waiting for the server to respond before updating the UI. This is not a good user experience, especially for a todo app where users expect immediate feedback.

This should be solve by using optimistic updates.

## Implementation

- Use tRPC correctly on the client to implement this feature.
- Only make changes in files that ABSOLUTELY need to be changed, so files that have a call of `useQuary` or `useMutation` from tRPC and also change something in the UI.
- To achieve optimistic updates, you have to assume a change was successful until proven otherwise, in which case you have to revert the change and show an error message in a toast.
- Toast does't yet exist in this project. Please use `npx shadcn@latest add` to add a toast and then restyle it as done before as described in the [`02-better-ui.md`](./02-better-ui.md) file. Do _NOT_ implement anything asked for in the `02-better-ui.md` file, just the toast and the optimistic updates!!
- The toast should also be used to show a success message and a loading state. This should be implemented using simple text (no animations or anything fancy in the toast content).
