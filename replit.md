# Green Power Solutions - Solar Energy Company Platform

## Overview

Green Power Solutions is a hybrid web application that combines a marketing website for a solar energy company with an integrated customer support platform. It features a public-facing website with AI-powered chat assistance and a comprehensive customer support system including ticketing, live chat, and user management. Built with React, Express, and MySQL, the platform serves both residential and commercial solar customers in Guyana, offering marketing content and robust support tools. The project aims to provide an all-encompassing digital solution for the solar energy sector, enhancing customer engagement and streamlining support operations.

## Recent Changes (October 2025)

### Rebranding to Green Power Solutions
- **Complete rebrand** from SolarTech to Green Power Solutions
- Updated all components: Header, Footer, Home, About, Contact, Login, AI Chat
- Redesigned hero section with "Empowering Tomorrow - Your Solar Energy Solution Provider"
- Updated all content to reflect Green Power Solutions' operations in Guyana
- Updated AI chatbot with 20+ FAQ entries from www.greenpowersolutions.co
- Added Guyana-specific content for pricing, installation, maintenance, and financing

### Technical Updates
- Configured for MySQL database (awaiting DATABASE_URL from user)
- Fixed Vite configuration with `allowedHosts: true` for Replit proxy compatibility
- Added missing AI service methods: `getFAQsByContext()`, `getFAQsByCategory()`, `getCategories()`
- Updated workflow to run on port 5000 with webview output
- All LSP errors resolved

### Replit Environment Setup (October 3, 2025)
- ✅ Successfully imported GitHub project and configured for Replit
- ✅ Dependencies installed (npm install completed)
- ✅ Workflow configured with webview output on port 5000
- ✅ Application running successfully - all routes working correctly
- ✅ Build process verified (npm run build works)
- ✅ Deployment configuration set (autoscale, build & start commands)
- ✅ Vite dev server properly configured with allowedHosts: true for proxy compatibility
- ℹ️ Database: MySQL configuration ready, awaiting DATABASE_URL for full database features

## User Preferences

Preferred communication style: Simple, everyday language.
**Important**: No external API dependencies for core features - use built-in solutions only.
**Database**: MySQL required (not PostgreSQL) - need DATABASE_URL credentials from user.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. Wouter handles client-side routing, and TanStack Query manages server state. UI components leverage Shadcn/ui with Radix UI primitives and Tailwind CSS, featuring a custom solar-themed design system with light/dark modes. State management utilizes React Context API for authentication and themes, and local storage for persistence. Key design patterns include Compound Components, Protected Routes, and Provider patterns.

### Backend Architecture

The backend uses Express.js with TypeScript and ES Modules. It provides RESTful API endpoints and a WebSocket server for real-time chat. Drizzle ORM is used for type-safe MySQL database operations, following a schema-first approach. A built-in intelligent chatbot handles AI functionalities without external API dependencies, featuring pattern matching, context-aware responses, and a comprehensive FAQ database.

### AI Service Architecture (`server/ai-service.ts`)

The AI service implements an `IntelligentChatbot` class with a singleton pattern. It uses a comprehensive FAQ database with 20+ entries tailored to Green Power Solutions, categorized by topics like pricing, services, installation, financing, and Guyana-specific operations. The chatbot employs keyword-based pattern matching, context filtering (e.g., `home`, `services`, `contact`), and a fuzzy matching algorithm for answer relevance, providing graceful fallbacks.

**Available Methods:**
- `findBestMatch(query, context?)` - Returns best FAQ answer for user query
- `getContextSuggestion(page)` - Provides page-specific chat suggestions
- `getFAQsByContext(context)` - Returns FAQs filtered by context
- `getFAQsByCategory(category?)` - Returns FAQs by category or all FAQs
- `getCategories()` - Returns list of all FAQ categories

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

## FAQ Content from Green Power Solutions

The AI chatbot includes comprehensive FAQs covering:
- **Pricing**: Cost ranges for 1kW-10kW systems in Guyana
- **Installation**: Professional installation process and timeline
- **Maintenance**: Ongoing monitoring and support services
- **Financing**: Payment options and government incentives
- **Services**: Solar surveys, assessments, custom solutions
- **Products**: Grid-tie, off-grid, and hybrid solar systems
- **Consultation**: Free assessments and quote process

## Next Steps

1. **Database Setup**: Waiting for MySQL DATABASE_URL credentials from user
2. **Testing**: Once database is connected, test all CRUD operations
3. **Deployment**: Configure production deployment settings
4. **Content**: Verify all Green Power Solutions content is accurate

## Development Commands

- `npm run dev` - Start development server (frontend + backend on port 5000)
- `npm run db:push` - Push Drizzle schema changes to MySQL database
- `npm run db:push --force` - Force push schema changes (for data-loss warnings)
- `npm run db:studio` - Open Drizzle Studio for database management
