# Introduction

This is a simple todo app built with Next.js, Clerk for authentication, and tRPC for type-safe API calls. The app allows users to create, view, and manage their todos. It features a responsive design and leverages Clerk's authentication system to ensure secure access.

# Data Model

The model is defined as a drizzle schema defined in the file [`src/db/schema.ts`](../src/server/db/schema.ts). Please refer to that file for the complete schema definition.

The most important parts of the model are:

## Todo

- `id`: Unique identifier for the todo item.
- `userId`: Identifier for the user who created the todo.
- `title`: The title of the todo item, which is also displayed as the main text of the todo.
- `isDone`: Boolean indicating whether the todo is completed.

# Technology Stack

- NextJS (TypeScript)
- tRPC
- Tailwind CSS
- Drizzle ORM (SQLite)
- Clerk (authentication)
- Prettier (code formatting)

# Conventions

- **Type Definitions**: Always use `type` declarations instead of `interface` for defining object types.
