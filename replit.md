# SolarTech - Solar Energy Company Platform

## Overview

SolarTech is a hybrid web application that combines a marketing website for a solar energy company with an integrated customer support platform. It features a public-facing website with AI-powered chat assistance and a comprehensive customer support system including ticketing, live chat, and user management. Built with React, Express, and MySQL, the platform serves both residential and commercial solar customers, offering marketing content and robust support tools. The project aims to provide an all-encompassing digital solution for the solar energy sector, enhancing customer engagement and streamlining support operations.

## User Preferences

Preferred communication style: Simple, everyday language.
**Important**: No external API dependencies for core features - use built-in solutions only.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. Wouter handles client-side routing, and TanStack Query manages server state. UI components leverage Shadcn/ui with Radix UI primitives and Tailwind CSS, featuring a custom solar-themed design system with light/dark modes. State management utilizes React Context API for authentication and themes, and local storage for persistence. Key design patterns include Compound Components, Protected Routes, and Provider patterns.

### Backend Architecture

The backend uses Express.js with TypeScript and ES Modules. It provides RESTful API endpoints and a WebSocket server for real-time chat. Drizzle ORM is used for type-safe MySQL database operations, following a schema-first approach. A built-in intelligent chatbot handles AI functionalities without external API dependencies, featuring pattern matching, context-aware responses, and a comprehensive FAQ database.

### AI Service Architecture (`server/ai-service.ts`)

The AI service implements an `IntelligentChatbot` class with a singleton pattern. It uses a comprehensive FAQ database with over 50 entries, categorized by topics like pricing, services, installation, and financing. The chatbot employs keyword-based pattern matching, context filtering (e.g., `home`, `services`, `contact`), and a fuzzy matching algorithm for answer relevance, providing graceful fallbacks.

### Data Schema

All entities use UUID primary keys. Key tables include:
- **Users**: Role-based access control (customer, agent, admin), email/username for authentication.
- **Tickets**: Status tracking (open, pending, resolved, closed), priority levels, category, agent assignment, file attachments, and timestamps.
- **CallbackRequests**: Customer info, preferred callback time, reason, status (pending, completed, cancelled), and timestamps.
- **Chat Messages**: Linked to tickets or standalone, agent/user distinction, file attachments, timestamps.
- **Notifications**: User-specific, type classification, read/unread status, related entity linking.
- **Ticket History**: Audit trail for ticket changes.

### Application Routing

**Public Routes:** `/`, `/services`, `/about`, `/contact`, `/faq`, `/login`.
**Protected Routes (Support Dashboard):** `/dashboard`, `/chat`, `/tickets`, `/callbacks`, `/notifications`, `/users`.

### Authentication & Authorization

Currently, a mock authentication system with role-based UI rendering (customer, agent, admin) is in place, with plans for migration to a real authentication system. Authorization levels dictate access to features like viewing tickets, managing queues, and user administration.

### Design System

A consistent design system utilizes a primary warm amber/gold and secondary deep teal color palette, with full light/dark mode support. Typography uses Inter for body text and Outfit for headings. Component styling includes rounded corners, a shadow system for elevation, and consistent hover/active states.

## External Dependencies

### Third-Party Services

- **Database**: MySQL database connection, configured via `DATABASE_URL` environment variable and managed through Drizzle ORM.
- **Communication Channels**: Direct WhatsApp link and mailto links for email support.

### UI Libraries

- **Radix UI Primitives**: Accessible UI components (Accordion, Dialog, Dropdown, Popover, Toast).
- **Supporting Libraries**: `class-variance-authority`, `cmdk`, `embla-carousel-react`, `date-fns`, `react-day-picker`, `react-icons`.

### Development Tools

- **Replit Integration**: Custom Vite plugins for Replit environment, including runtime error modal, development banner, and Cartographer. Vite middleware is specifically configured to handle `/api` route passthrough.
- **Build Tools**: esbuild for server-side bundling, PostCSS with Tailwind and Autoprefixer, TypeScript compiler.

### Database Management

- **Drizzle Kit**: Used for schema management, migrations, and development schema updates with MySQL dialect.