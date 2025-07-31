# Change in needed UI

**Note: Before implementing, please read [`01-intro.md`](./01-intro.md) for project overview and coding conventions.**

The base issue that has to be solved is that customers have complained about how the UI looks. Main points of criticism are:

- The primary color pink and the brown-gradient background look unfitting together as they don't contrast much and they also don't really represent what a todo list is (a productivity tool).
- The unfamiliar feel of the color palette is lowering customer retention and cause reveniue loss.
- The input fields are way too rounded and should look more standardized with common frameworks like Material UI or Bootstrap.

## Implementation

- TAILWIND must be used!!!
- All kinds of input that an app like this might require (one of text inputs, checkboxes, date inputs, select fields, yet NOT buttons) should get their own Next client component where with all the necessary props. Please do NOT use references, only use simple state management.
- The components should be placed in the `src/app/_components/ui` folder.
- All styling must be responsive and should work on desktop, tablet, and mobile devices.
- Components should have very minimal logic, only the necessary state management. All logic should be handled in the parent component.
- Animations should be used, yet very minimal and with a very low transition time. These should ONLY be CSS based for best performance (use tailwind for everything and add necessary keyframes if needed to the [`tailwind.config.js`](../tailwind.config.js) file).
- The huge exception is textarea, which should NOT have an animation.

## Color Scheme Requirements

- Use the color palette from [`02-color-palette.png`](./02-color-palette.png) as inspiration but adapt it for a professional productivity tool
- Replace the previous blue primary colors with a pink peacock-inspired color scheme
- Ensure proper contrast ratios for accessibility in both light and dark modes
- Use CSS custom properties (design tokens) instead of hard-coded colors
- Update the global color scheme in `src/styles/globals.css` with appropriate OKLCH color values

## Component Requirements

- **TextInput**: Support text, email, password, search types. Include error states, disabled states, and proper focus management.
- **Checkbox**: Custom styled checkbox with label support, disabled states, and proper accessibility.
- **DateInput**: HTML5 date input with consistent styling across browsers.
- **Select**: Custom styled select dropdown with options array, placeholder support.
- **TextArea**: Multi-line text input with optional character count, resize control.

## Additional Tasks

- Update existing components (todos-form, todo-list) to use the new UI components
- Add a toggle mutation to the tRPC todos router for marking todos as complete/incomplete
- Update the Skeleton component to use appropriate neutral colors instead of accent colors
- Ensure all components follow the project's TypeScript conventions as outlined in `01-intro.md`
