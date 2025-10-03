# SolarTech - Solar Energy Company Platform

## Overview

SolarTech is a hybrid web application combining a marketing website for a solar energy company with an integrated customer support platform. The application features a public-facing solar company website with AI-powered chat assistance, alongside a comprehensive customer support system with ticketing, live chat, and user management capabilities. Built with React, Express, and MySQL, it serves residential and commercial solar customers with both marketing content and support tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- New York style variant configuration
- Custom theme system supporting light/dark modes with solar-themed color palette

**State Management**
- React Context API for authentication state (`AuthContext`)
- React Context API for theme management (`ThemeContext`)
- TanStack Query for server state synchronization
- Local storage for user session and theme persistence

**Key Design Patterns**
- Compound component pattern for UI components
- Protected route pattern for authenticated pages
- Provider pattern for global state (auth, theme, query client)
- Custom hooks for reusable logic (`use-mobile`, `use-toast`)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- ES Modules for modern JavaScript syntax
- HTTP server for REST endpoints
- WebSocket server (ws) for real-time chat functionality

**API Design**
- RESTful API endpoints under `/api` prefix
- WebSocket endpoint at `/ws` for live chat
- Middleware for request logging and error handling
- Session-based logging with JSON response capture

**Database Layer**
- Drizzle ORM for type-safe database operations
- MySQL as the primary database (mysql2 driver)
- Schema-first approach with Drizzle migrations
- Storage abstraction layer for CRUD operations

**Real-time Communication**
- WebSocket connections for live chat between customers and agents
- Client-user identification system for chat routing
- Broadcast capabilities for multi-user chat scenarios

**AI Integration**
- OpenAI API integration for AI-powered customer support chat
- Context-aware responses about solar products and services
- Graceful degradation when API key is unavailable
- System prompts tailored to SolarTech business domain

### Data Schema

**Users Table**
- UUID primary keys for all entities
- Role-based access control (customer, agent, admin)
- Email and username for authentication
- Created timestamp tracking

**Tickets Table**
- Status tracking (open, pending, resolved, closed)
- Priority levels (low, medium, high, urgent)
- Category classification
- Assignment to support agents
- File attachment support via JSON array
- Timestamps for creation, updates, and resolution

**Chat Messages Table**
- Linked to tickets or standalone conversations
- Agent/user distinction flag
- File attachment support
- Timestamp tracking

**Notifications Table**
- User-specific notifications
- Type classification (ticket, chat, system)
- Read/unread status
- Related entity linking via relatedId

**Ticket History Table** (referenced but implementation not shown)
- Audit trail for ticket changes
- Action tracking with responsible user

### Application Routing

**Public Routes (Marketing Site)**
- `/` - Home page with hero and features
- `/services` - Solar services overview
- `/about` - Company information
- `/contact` - Contact form and information
- `/faq` - Frequently asked questions
- `/login` - Authentication page

**Protected Routes (Support Dashboard)**
- `/dashboard` - Role-specific dashboard with statistics
- `/chat` - Live chat interface (WebSocket-based)
- `/tickets` - Ticket management system
- `/notifications` - Notification center
- `/users` - User management (admin only)

### Authentication & Authorization

**Current Implementation**
- Mock authentication system stored in localStorage
- Role-based UI rendering (customer, agent, admin)
- Protected route wrapper component
- Planned migration to real authentication system

**Authorization Levels**
- Customer: View own tickets, initiate chat, access personal dashboard
- Agent: Access ticket queue, respond to chats, view assigned tickets
- Admin: Full system access including user management

### Design System

**Color Palette**
- Primary brand: Warm amber/gold (HSL 35 100% 45%) representing solar energy
- Secondary: Deep teal (HSL 195 85% 35%) for sustainability
- Comprehensive light/dark mode support with separate color scales
- Success, warning, and error semantic colors

**Typography**
- Inter for body text (weights 300-700)
- Outfit for headings (weights 400-800)
- JetBrains Mono for code/monospace text
- Responsive font scaling

**Component Styling**
- Rounded corners with consistent border radius scale
- Shadow system for elevation
- Hover and active state elevation effects
- Border treatments with opacity-based outlines

## External Dependencies

### Third-Party Services

**OpenAI API**
- Used for AI-powered chat assistant
- Requires `OPENAI_API_KEY` environment variable
- Provides context-aware customer support responses
- Fallback messaging when unavailable

**Database**
- MySQL database connection
- Requires `DATABASE_URL` environment variable
- Managed through Drizzle ORM

### Communication Channels

**WhatsApp Integration**
- Direct link to WhatsApp business number (555-123-4567)
- Opens pre-filled support message

**Email Support**
- Mailto links to support@solartech.com
- Pre-populated subject lines

### UI Libraries

**Radix UI Primitives**
- Comprehensive set of accessible UI components
- Accordion, Dialog, Dropdown, Popover, Toast, and more
- Unstyled primitives for custom styling

**Supporting Libraries**
- `class-variance-authority` for component variant management
- `cmdk` for command palette functionality
- `embla-carousel-react` for carousel components
- `date-fns` for date manipulation
- `react-day-picker` for calendar/date selection
- `react-icons` for icon library (WhatsApp icon)

### Development Tools

**Replit Integration**
- Custom Vite plugins for Replit environment
- Runtime error modal overlay
- Development banner
- Cartographer for code navigation
- WebSocket HMR configuration for Replit proxy

**Build Tools**
- esbuild for server-side bundling
- PostCSS with Tailwind and Autoprefixer
- TypeScript compiler for type checking

### Database Management

**Drizzle Kit**
- Schema management and migrations
- Push command for development schema updates
- MySQL dialect configuration