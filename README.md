# Chat App

This is a **real-time chat application** built with [Next.js](https://nextjs.org) and [Socket.io](https://socket.io). The app allows users to create or join chat rooms and send messages in real time. The first user to enter a room automatically becomes the owner.

## Features

-   **Real-time messaging** with Socket.io
-   **Dynamic room creation**
-   **Ownership assignment**: The first user in a room becomes the owner
-   **Next.js 15** with Turbopack for fast development
-   **TailwindCSS** for modern UI styling

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

To start the **Next.js** development server:

```bash
npm run dev
```

To start the **Socket.io** server:

```bash
npm run dev:socket
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

To build the application:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

To start the production **Socket.io** server:

```bash
npm run start:socket
```

## Scripts

| Script                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Starts the Next.js development server           |
| `npm run dev:socket`   | Starts the Socket.io server in development mode |
| `npm run build`        | Builds the Next.js app                          |
| `npm run build:socket` | Builds the Socket.io server for production      |
| `npm run start`        | Starts the Next.js app in production            |
| `npm run start:socket` | Starts the Socket.io server in production       |
| `npm run lint`         | Runs ESLint for code quality checks             |

## Learn More

To learn more about the technologies used in this project:

-   [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
-   [Socket.io Documentation](https://socket.io/docs/) - Learn how real-time communication works.
-   [TailwindCSS](https://tailwindcss.com/docs) - Styling framework for modern UI.

## Deployment

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com).

For detailed deployment instructions, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
