# Design Guidelines: Solar Service Company Website

## Design Approach

**Selected Approach:** Hybrid (Reference-based Marketing + Design System Utility)

**Justification:** This project combines experience-focused marketing needs (trust, visual impact, conversion) with utility-focused support features (chat, tickets, authentication). Drawing inspiration from Tesla Solar's modern aesthetic and Linear's clean interface patterns, balanced with sustainability-focused warmth.

**Key Design Principles:**
- Trust through clarity: Professional, transparent information architecture
- Sustainable sophistication: Modern aesthetics with environmental consciousness
- Seamless integration: Marketing and support features feel unified
- Performance-focused: Fast-loading despite rich visuals

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary Brand: `35 100% 45%` (warm amber/gold - solar energy)
- Secondary: `195 85% 35%` (deep teal - sustainability)
- Background Base: `40 20% 98%` (warm off-white)
- Surface: `0 0% 100%` (pure white cards)
- Surface Elevated: `40 15% 99%` (modals)
- Border: `40 10% 88%` (soft separation)
- Text Primary: `210 15% 12%` (charcoal)
- Text Secondary: `210 10% 40%` (muted)
- Text Tertiary: `210 8% 55%` (hints)
- Success: `145 70% 42%` (green)
- Warning: `35 95% 50%` (amber alert)
- Error: `0 80% 55%` (red)

**Dark Mode:**
- Primary Brand: `35 100% 55%` (brighter amber)
- Secondary: `195 75% 45%` (lighter teal)
- Background Base: `210 15% 8%` (deep charcoal)
- Surface: `210 15% 12%` (cards)
- Surface Elevated: `210 15% 15%` (modals)
- Border: `210 12% 22%` (borders)
- Text Primary: `40 15% 96%` (warm white)
- Text Secondary: `210 10% 68%` (muted)
- Text Tertiary: `210 8% 50%` (hints)
- Success: `145 70% 50%` (brighter green)
- Warning: `35 95% 58%` (brighter amber)
- Error: `0 80% 62%` (brighter red)

### B. Typography

**Font Families:**
- Primary: Inter (body, UI, forms)
- Display: Outfit (headlines, hero text - bold, modern)
- Mono: JetBrains Mono (technical specs, ticket IDs)

**Scale:**
- Hero Display: 56px/3.5rem, font-bold (landing hero)
- Display: 40px/2.5rem, font-bold (section headers)
- H1: 32px/2rem, font-semibold (page titles)
- H2: 24px/1.5rem, font-semibold (subsections)
- H3: 18px/1.125rem, font-medium (card titles)
- Body: 16px/1rem, font-normal (main content)
- Small: 14px/0.875rem, font-normal (metadata)
- Tiny: 12px/0.75rem, font-medium (badges)

### C. Layout System

**Spacing Primitives:** Tailwind units of `2, 4, 6, 8, 12, 16, 20`

**Landing Page Structure:**
- Hero: 85vh with full-bleed imagery
- Content sections: py-20 desktop, py-12 mobile
- Section max-width: max-w-7xl
- Text content: max-w-3xl
- Feature grids: 3 columns desktop, 2 tablet, 1 mobile

**Dashboard/Support Layout:**
- Sidebar: 260px fixed
- Content: flex-1 with max-w-6xl
- Component spacing: p-6, gap-4
- Form containers: max-w-2xl

### D. Component Library

**Marketing Components:**
- Hero: Full-bleed image, centered headline + subtext, dual CTA buttons (Primary solid + Secondary with backdrop-blur bg-white/10)
- Feature Cards: Icon top, title, description, hover lift effect - 3-column grid
- Service Showcase: Image left/right alternating, generous text space, stats integration
- Testimonial Cards: Photo, quote, name/company - 3-column carousel
- Stats Bar: Large numbers with labels, subtle background accent
- CTA Sections: Contrasting background, centered content, dual buttons
- Footer: 4-column grid (Services, Company, Resources, Contact), newsletter signup, social links, trust badges

**Utility Components (Support/Dashboard):**
- Navigation: Sidebar with icon + label, user role-based items
- Chat Interface: Fixed height panel, message bubbles (customer/agent), typing indicator, file attachments
- Ticket System: Priority color accent, status badges, assignee avatars, timeline view
- Forms: Stacked labels, validation states, file upload with drag-drop
- Modals: Centered overlay, backdrop blur, max-w-2xl
- Tables: Striped rows, sortable headers, action buttons
- Notifications: Toast bottom-right, inline alerts
- Auth Pages: Centered card, max-w-md, illustration side panel

**Shared Elements:**
- Buttons: Primary (filled amber), Secondary (teal outline), Ghost (text)
- Badges: Pill status indicators, color-coded
- Input Fields: Border focus ring, helper text below
- Cards: Subtle shadow, rounded-xl, hover elevation
- Avatars: Circular with initials fallback

### E. Animations

Use sparingly:
- Hero: Subtle parallax on scroll (0.3 factor)
- Cards: Hover lift (translateY -4px, 200ms)
- Buttons: Color shift on hover (150ms)
- Modal: Fade + scale entry (250ms)
- Toast: Slide-in from bottom (300ms)
- Avoid: Excessive scroll animations, page transitions

---

## Images

**Hero Section (Homepage):**
- Full-bleed image: Residential rooftop solar installation at golden hour, wide angle showcasing clean panels against blue sky
- Dimensions: 1920x1080 minimum
- Overlay: Subtle gradient (black/20 to transparent) for text legibility

**Service Showcase:**
- Residential installations: Family home with solar panels
- Commercial projects: Large-scale industrial/business installations
- Installation process: Team members working professionally
- Before/After: Energy bill comparisons, monitoring dashboards

**About/Trust Indicators:**
- Team photos: Professional headshots, authentic candids
- Certifications: Industry badges, partner logos
- Product gallery: Solar panel close-ups, inverters, battery systems

**Empty States (Dashboard):**
- "No active tickets" illustration: Solar panel with checkmark
- "No messages" illustration: Chat bubble with sun icon
- Muted color palette matching theme

---

## Page-Specific Design

**Homepage Sections:**
1. Hero: Full-bleed image, headline "Power Your Future with Solar", dual CTAs
2. Services Overview: 3-column cards (Residential, Commercial, Maintenance)
3. How It Works: 4-step process with icons, numbered flow
4. Products: Solar panel models, battery storage - image + specs cards
5. Stats Bar: Projects completed, kW installed, CO2 offset, clients served
6. Testimonials: 3-column customer reviews with photos
7. FAQ: Accordion-style, 8-10 common questions
8. CTA Section: "Get Your Free Quote Today" with form preview
9. Footer: Comprehensive links, newsletter, trust badges

**Support Dashboard:**
- Unified design system with marketing site color palette
- Chat widget: Bottom-right floating button, expandable panel
- Ticket creation: Multi-step form (Issue type, Description, Photos, Contact)
- File uploads: Drag-drop zone for installation photos, energy bills
- User portal: Ticket history, chat history, profile management

**Responsive Strategy:**
- Mobile: Stack all columns, bottom nav for dashboard, hamburger menu for marketing
- Tablet: 2-column grids, collapsible sidebar
- Desktop: Full multi-column layouts, persistent navigation