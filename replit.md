# SolarTech - Solar Energy Company Platform

## Overview

SolarTech is a hybrid web application combining a marketing website for a solar energy company with an integrated customer support platform. The application features a public-facing solar company website with AI-powered chat assistance, alongside a comprehensive customer support system with ticketing, live chat, and user management capabilities. Built with React, Express, and MySQL, it serves residential and commercial solar customers with both marketing content and support tools.

## Recent Changes (October 3, 2025)

### Comprehensive Quick Support System

#### Built-in AI Chatbot (No External Dependencies)
- ✅ **Removed OpenAI dependency** - Replaced with sophisticated built-in intelligent chatbot system
- ✅ **Pattern matching AI** - 50+ FAQ entries with keyword detection and context awareness
- ✅ **Comprehensive knowledge base** - Solar services, pricing, technical specs, financing, installation
- ✅ **Intelligent scoring system** - Fuzzy matching algorithm for best answer selection
- ✅ **Context-aware responses** - Detects current page and provides relevant information
- ✅ **Fallback handling** - Graceful degradation with helpful suggestions

#### Page-Context Detection & Auto-Fill
- ✅ **Smart context detection** - API endpoint analyzes current page and user journey
- ✅ **Auto-fill contact forms** - Pre-populates service selection and message templates based on referring page
- ✅ **Service mapping** - Maps page context to appropriate service category automatically
- ✅ **AI-powered suggestions** - Displays contextual hints in contact form headers

#### Agent Availability System
- ✅ **Real-time availability check** - `/api/agents/online` endpoint checks for active agents
- ✅ **Automatic fallback** - Redirects to callback/ticket when agents offline
- ✅ **Visual indicators** - Disabled state and offline badges in QuickSupportDialog
- ✅ **Alert notifications** - User-friendly messages when live chat unavailable

#### Callback Request System
- ✅ **Complete database schema** - `callbackRequests` table with status tracking
- ✅ **API endpoints** - Full CRUD operations for callback management
- ✅ **Management portal** - Dedicated `/callbacks` page for admins/agents
- ✅ **Status tracking** - Pending, completed, cancelled workflow
- ✅ **Email integration** - Confirmation emails and notifications
- ✅ **Preferred time selection** - Morning, afternoon, evening, anytime options

#### Enhanced QuickSupportDialog
- ✅ **5-Tab Interface**:
  1. **AI Support** - Context-aware chatbot with page detection
  2. **Navigation Help** - Site navigation assistance
  3. **Live Chat** - Real-time agent communication (when available)
  4. **Callback Request** - Schedule callback when agents offline
  5. **Submit Ticket** - Create support tickets for asynchronous help
- ✅ **Agent availability integration** - Live chat tab disabled when agents offline
- ✅ **Contextual alerts** - Displays offline notice with alternative options
- ✅ **Seamless UX** - Smooth transitions between support channels

#### AI-Powered FAQ Widget
- ✅ **Context-aware display** - Shows relevant FAQs based on current page
- ✅ **Dynamic loading** - Fetches FAQs from `/api/faq?context={page}` endpoint
- ✅ **Page-specific content**:
  - Home page: General solar info, pricing, getting started
  - Services page: Service-specific FAQs and details
  - Contact page: Support options and communication methods
- ✅ **Accordion interface** - Clean, expandable FAQ items with category badges
- ✅ **Automatic filtering** - Shows top 5 most relevant FAQs per page

#### Management Portal Enhancements
- ✅ **CallbacksPage** - Comprehensive callback management interface
- ✅ **Statistics dashboard** - Pending, completed, total request metrics
- ✅ **Table view** - Sortable, filterable callback list
- ✅ **Status management** - Bulk status updates (pending → completed/cancelled)
- ✅ **Details modal** - Full callback information display
- ✅ **Role-based access** - Admin and agent sidebar integration
- ✅ **Search & filter** - Find callbacks by name, phone, status, date

#### Critical Bug Fixes
- ✅ **Vite middleware fix** - Added `/api` route passthrough in server/vite.ts
- ✅ **API routing** - Prevented Vite catch-all from intercepting Express API routes
- ✅ **JSON responses** - All API endpoints now correctly return JSON data
- ✅ **FAQ endpoint** - `/api/faq` properly returns context-filtered FAQ arrays

### Previous Updates

#### Replit Environment Setup
- ✅ Successfully configured for Replit deployment
- ✅ Workflow configured: "Start application" running `npm run dev` on port 5000
- ✅ Vite middleware mode with `allowedHosts: true` for Replit proxy support
- ✅ Frontend and backend integrated on single port (5000)
- ✅ All dependencies installed and verified working
- ✅ Application successfully running in Replit environment

#### Database Configuration
- Converted from PostgreSQL (Neon) to MySQL/MariaDB
- Updated Drizzle ORM configuration for MySQL dialect
- Implemented lazy database connection for graceful degradation
- External database: `5.181.218.15:3306` (requires IP whitelisting for Replit: 136.117.137.191)
- DATABASE_URL secret configured in Replit Secrets

#### API Implementation
- Added complete REST API endpoints for Users, Tickets, Notifications, and Chat Messages
- Implemented automatic notification creation on ticket events
- Added ticket history tracking for audit trail
- All API routes connected to database storage layer
- **New**: FAQ API with context filtering
- **New**: Agent availability check API
- **New**: Callback request CRUD APIs
- **New**: Page context detection API

#### Support System Features
- ✅ Footer Support Buttons (Live Chat, AI Chat, WhatsApp, Email)
- ✅ Quick Support Popup Button (global access on all pages)
  - AI Support tab with built-in intelligent chatbot (no OpenAI)
  - Navigation Help tab for site guidance
  - Live Chat tab with agent availability detection
  - Callback Request tab for offline support
  - Guest Ticket Submission tab for anonymous support requests
- ✅ AI-powered FAQ widget on all pages (Home, Services, Contact)
- ✅ Context-aware contact forms with auto-fill
- ✅ WebSocket live chat for real-time agent communication
- ✅ File upload capability in chat and tickets
- ✅ Multi-stage ticket system with priority and status tracking
- ✅ User authentication and role-based access control
- ✅ Notification system with push notifications
- ✅ Admin portal with user and callback management

## User Preferences

Preferred communication style: Simple, everyday language.
**Important**: No external API dependencies for core features - use built-in solutions only.

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
- **New**: Vite middleware configured to skip `/api` routes

**Database Layer**
- Drizzle ORM for type-safe database operations
- MySQL as the primary database (mysql2 driver)
- Schema-first approach with Drizzle migrations
- Storage abstraction layer for CRUD operations
- **New**: CallbackRequests table for callback management

**Real-time Communication**
- WebSocket connections for live chat between customers and agents
- Client-user identification system for chat routing
- Broadcast capabilities for multi-user chat scenarios

**AI Integration**
- **Built-in intelligent chatbot** - No external API dependencies
- Pattern matching with keyword detection
- Context-aware responses about solar products and services
- 50+ FAQ database with category and context filtering
- Fuzzy matching algorithm for best answer selection
- Graceful fallback responses when no match found

### AI Service Architecture (`server/ai-service.ts`)

**IntelligentChatbot Class**
- Singleton pattern for global chatbot instance
- FAQ database with comprehensive solar knowledge
- Keyword-based pattern matching
- Context filtering for page-specific responses
- Scoring algorithm for answer relevance

**FAQ Item Structure**
```typescript
interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  context?: string[]; // Pages where this FAQ is relevant
}
```

**Categories**
- pricing: Cost and pricing information
- services: Solar service offerings
- installation: Installation process and timeline
- financing: Payment options and incentives
- maintenance: System upkeep and warranties
- savings: ROI and energy savings
- technical: Technical specifications
- company: Company information
- storage: Energy storage solutions
- getting-started: How to begin process

**Context Mapping**
- home: General solar information
- services: Service-specific details
- about: Company and experience
- contact: Support options
- faq: Frequently asked questions

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

**CallbackRequests Table** (NEW)
- ID (auto-increment)
- Customer information (name, email, phone)
- Preferred callback time
- Reason for callback
- Status (pending, completed, cancelled)
- Contact timestamp
- Created timestamp

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

**Ticket History Table**
- Audit trail for ticket changes
- Action tracking with responsible user

### Application Routing

**Public Routes (Marketing Site)**
- `/` - Home page with hero, features, and FAQ widget
- `/services` - Solar services overview with FAQ widget
- `/about` - Company information
- `/contact` - Contact form with context-aware auto-fill and FAQ widget
- `/faq` - Frequently asked questions
- `/login` - Authentication page

**Protected Routes (Support Dashboard)**
- `/dashboard` - Role-specific dashboard with statistics
- `/chat` - Live chat interface (WebSocket-based)
- `/tickets` - Ticket management system
- `/callbacks` - Callback request management (admin/agent)
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
- Agent: Access ticket queue, respond to chats, view assigned tickets, manage callbacks
- Admin: Full system access including user management, callback management, system settings

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

**Database**
- MySQL database connection
- Requires `DATABASE_URL` environment variable
- Managed through Drizzle ORM

**Note**: OpenAI API dependency has been **removed**. The application now uses a built-in intelligent chatbot system with no external API requirements for AI functionality.

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
- **Modified Vite middleware** to properly handle `/api` routes

**Build Tools**
- esbuild for server-side bundling
- PostCSS with Tailwind and Autoprefixer
- TypeScript compiler for type checking

### Database Management

**Drizzle Kit**
- Schema management and migrations
- Push command for development schema updates
- MySQL dialect configuration

## API Endpoints

### Support System APIs

**Chat & AI**
- `POST /api/chat` - Send message to AI chatbot (built-in, no OpenAI)
- `GET /api/faq` - Get FAQs (with optional category or context filtering)
- `GET /api/faq/categories` - Get all FAQ categories

**Callbacks**
- `GET /api/callbacks` - List all callback requests
- `POST /api/callbacks` - Create new callback request
- `PATCH /api/callbacks/:id` - Update callback status

**Agents**
- `GET /api/agents/online` - Check agent availability

**Context Detection**
- `GET /api/context` - Get page context for auto-fill
- `POST /api/context/detect` - Detect context from URL

**Tickets**
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/:id` - Update ticket

**Users**
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user

**Notifications**
- `GET /api/notifications` - List notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id` - Update notification

## Key Components

### QuickSupportDialog
Location: `client/src/components/QuickSupportDialog.tsx`

Comprehensive support dialog with 5 tabs:
1. **AI Support Tab** - Context-aware chatbot
2. **Navigation Help Tab** - Site navigation
3. **Live Chat Tab** - Real-time agent chat (availability-aware)
4. **Callback Request Tab** - Schedule callback
5. **Submit Ticket Tab** - Create support ticket

Features:
- Agent availability detection on dialog open
- Automatic tab disabling when agents offline
- Alert notification for offline agents
- Smooth tab transitions

### FAQWidget
Location: `client/src/components/FAQWidget.tsx`

Context-aware FAQ widget for pages:
- Detects current page from URL
- Fetches relevant FAQs from API
- Displays top 5 FAQs in accordion
- Category badges for organization
- Auto-hides when no FAQs available

### CallbackRequestTab
Location: `client/src/components/support-tabs/CallbackRequestTab.tsx`

Callback request form:
- Name, email, phone validation
- Preferred time selection
- Reason textarea
- Success confirmation screen
- Toast notifications

### CallbacksPage
Location: `client/src/pages/CallbacksPage.tsx`

Management interface for callbacks:
- Statistics cards (pending, completed, total)
- Filterable table view
- Status update dropdown
- Details modal
- Real-time updates via TanStack Query

### IntelligentChatbot Service
Location: `server/ai-service.ts`

Built-in AI chatbot:
- 50+ FAQ entries with keywords
- Context filtering by page
- Category organization
- Fuzzy matching algorithm
- Greeting and thank you detection
- Fallback responses

## Development Notes

### Important Configuration

**Vite Middleware** (`server/vite.ts`)
- **Critical**: Added `/api` route passthrough to prevent Vite from intercepting API calls
- Vite catch-all must skip `/api` routes: `if (url.startsWith("/api")) return next();`
- This fix ensures Express API routes work correctly in development

**Database Connection**
- Lazy connection with graceful degradation
- External MySQL database requires IP whitelisting
- Connection pooling for performance

**WebSocket Chat**
- Real-time bidirectional communication
- Client identification system
- Broadcast support for multi-user chats

### Testing Checklist

✅ **AI Chatbot**
- [ ] FAQ responses accurate
- [ ] Context detection working
- [ ] Keyword matching functional
- [ ] Fallback responses appropriate

✅ **FAQ Widget**
- [ ] Displays on Home, Services, Contact pages
- [ ] Context-specific FAQs loaded
- [ ] Accordion interaction smooth
- [ ] Category badges correct

✅ **Callback System**
- [ ] Form validation works
- [ ] API creates callback in database
- [ ] Management page lists callbacks
- [ ] Status updates persist
- [ ] Details modal displays correctly

✅ **Quick Support Dialog**
- [ ] Agent availability check works
- [ ] Live chat disabled when offline
- [ ] Callback tab accessible
- [ ] AI chatbot responds
- [ ] All 5 tabs functional

✅ **Contact Form Auto-Fill**
- [ ] Context detection from URL
- [ ] Service pre-selection works
- [ ] Message template populated
- [ ] AI badge displayed

### Future Enhancements

**Planned Features**
- [ ] Real authentication system (replace mock)
- [ ] Email notifications for callbacks
- [ ] SMS notifications option
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice call integration
- [ ] Video chat capability
- [ ] Mobile app version

**System Improvements**
- [ ] Redis caching for FAQ responses
- [ ] Elasticsearch for advanced search
- [ ] CDN integration for assets
- [ ] Progressive web app (PWA)
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] A/B testing framework

## Troubleshooting

### Common Issues

**API Routes Return HTML Instead of JSON**
- **Cause**: Vite catch-all middleware intercepting `/api` routes
- **Fix**: Ensure `server/vite.ts` has `/api` passthrough: `if (url.startsWith("/api")) return next();`

**FAQ Widget Not Displaying**
- **Check**: Browser console for fetch errors
- **Verify**: `/api/faq?context=home` returns JSON array
- **Test**: `curl http://localhost:5000/api/faq?context=home`

**Agent Availability Always Shows Offline**
- **Check**: `/api/agents/online` endpoint returns `{available: true/false}`
- **Verify**: Users with role "agent" or "admin" exist in database

**Callback Form Submission Fails**
- **Check**: Network tab for API response
- **Verify**: All required fields filled
- **Test**: POST to `/api/callbacks` with valid payload

### Debug Commands

```bash
# Test FAQ API
curl http://localhost:5000/api/faq?context=home

# Test agent availability
curl http://localhost:5000/api/agents/online

# Test callback creation
curl -X POST http://localhost:5000/api/callbacks \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"555-1234","preferredTime":"Morning","reason":"Test"}'

# Check database connection
npm run db:push

# View server logs
# Check workflow logs in Replit UI
```

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── QuickSupportDialog.tsx
│   │   │   ├── FAQWidget.tsx
│   │   │   ├── support-tabs/
│   │   │   │   ├── AISupportTab.tsx
│   │   │   │   ├── CallbackRequestTab.tsx
│   │   │   │   ├── LiveChatTab.tsx
│   │   │   │   ├── NavigationHelpTab.tsx
│   │   │   │   └── TicketSubmissionTab.tsx
│   │   │   └── ...
│   │   ├── pages/         # Page components
│   │   │   ├── solar/     # Public marketing pages
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Services.tsx
│   │   │   │   ├── Contact.tsx
│   │   │   │   └── About.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CallbacksPage.tsx
│   │   │   ├── TicketsPage.tsx
│   │   │   └── ...
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express application
│   ├── ai-service.ts      # Built-in chatbot (no OpenAI)
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database abstraction
│   ├── vite.ts            # Vite dev server setup
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle schema definitions
└── db/                    # Database migrations
```

## Credits & Acknowledgments

Built with modern web technologies and powered by solar energy principles. Special thanks to the Replit platform for enabling rapid development and deployment.
