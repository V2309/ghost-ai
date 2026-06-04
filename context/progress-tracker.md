# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Awaiting next feature specification.

- Next.js 16 boilerplate cleaned up (globals.css stripped to Tailwind import, minimal page.tsx).
- **Feature 10: Liveblocks Setup** ✓
  - Configured `liveblocks.config.ts` with Presence and UserMeta types
  - Implemented cached Liveblocks node client in `lib/liveblocks-server.ts`
  - Created deterministic color mapping helper in `lib/colors.ts`
  - Implemented `POST /api/liveblocks-auth` with Clerk auth and project access verification
  - Auto-creation of Liveblocks rooms with private default access
  - Updated `getCurrentIdentity` to return full user profile for session metadata
  - Verified `npm run build` passes
- **Feature 01: Design System** ✓
  - shadcn/ui installed and configured (Nova preset, Radix, Tailwind v4)
  - Components added: Button, Input, Tabs, Textarea, Card, Dialog, ScrollArea → `components/ui/`
  - lucide-react installed
  - `lib/utils.ts` created with `cn()` helper (clsx + tailwind-merge)
  - `globals.css` updated with Ghost AI dark-only CSS custom property tokens mapped via `@theme inline`
  - `html` element gets `dark` class for shadcn dark: variant support
  - All components import without errors; no default light styling appears
- **Feature 02: Editor base chrome** ✓
  - Navbar and Project Sidebar implemented
- **Feature 03: Authentication (Clerk)** ✓
  - `ClerkProvider` added with `@clerk/ui/themes` `dark` theme
  - Custom sign-in/sign-up pages using existing CSS variables
  - `proxy.ts` setup for route protection
  - Root route (`/`) redirect logic implemented
  - `UserButton` added to EditorNavbar
- **Feature 04: Project dialogs and editor home** ✓
  - Editor home screen with centered heading, description, and "New Project" button
  - Create Project dialog with live slug preview
  - Rename Project dialog with auto-focus and Enter key submission
  - Delete Project dialog with destructive confirmation
  - Sidebar project list with mock data
  - Sidebar actions (rename, delete) for owned projects only
  - Mobile backdrop scrim to close sidebar
  - useProjectDialog hook for dialog and form state management
  - DropdownMenu component installed and integrated
  - All dialogs wired to editor page and sidebar actions
- **Feature 05: Prisma data models and client** ✓
  - `prisma/models/project.prisma` created with `Project` and `ProjectCollaborator` models
  - `Project`: ownerId (Clerk), name, optional description, `ProjectStatus` enum (DRAFT/ARCHIVED), `canvasJsonPath`, timestamps, indexes on ownerId and createdAt
  - `ProjectCollaborator`: project relation with cascade delete, email, createdAt, unique on project/email, indexes on email and project/date
  - `lib/prisma.ts` singleton with hot-reload caching on `global`; branches on `DATABASE_URL` — Accelerate path (`prisma+postgres://`) uses `accelerateUrl` + `withAccelerate()`, direct path uses `@prisma/adapter-pg`
  - Migration `20260509082538_init_projects` applied successfully
  - `@prisma/client`, `@prisma/adapter-pg`, `pg`, `@prisma/extension-accelerate` installed
  - `npm run build` passes (TypeScript clean, all routes compile)
- **Feature 06: Project APIs** ✓
  - REST endpoints created for GET (list), POST (create), PATCH (rename), DELETE (delete)
  - Owner checks enforced using Clerk `userId`
  - 401 and 403 authorization and authentication checks implemented
  - Build checks passed
- **Feature 07: Wire Editor Home** ✓
  - Editor home page converted to a server component
  - Sidebar connected to real server-side data via `getProjectsForUser`
  - `use-project-actions` hook created to handle API mutations (create, rename, delete)
  - Hook exposed via Context Provider from layout
  - Real room ID generated on create and router navigated to the new workspace
  - Router properly refreshed or redirected after mutations
- **Feature 08: Editor Workspace Shell** ✓
  - Created `lib/project-access.ts` with helpers `getCurrentIdentity` and `checkProjectAccess`.
  - Created `components/editor/access-denied.tsx` with a centered layout, lock icon, and return link.
  - Built `/editor/[roomId]/page.tsx` server component with server-side access checks using Clerk and Prisma.
  - Redirected unauthenticated users to `/sign-in` and unauthorized users to `<AccessDenied />`.
  - Updated `EditorNavbar`, `EditorLayout`, and `ProjectSidebar` to accept `projectName`, `currentRoomId`, and `rightActions` for proper layout rendering in a workspace context.
  - Implemented canvas area placeholder with dark background.
  - Implemented AI assistant right sidebar placeholder.
- **Feature 09: Share Dialog** ✓
  - Share button added to editor navbar
  - Share Dialog implemented with link copying and collaborator list
  - Clerk data enrichment for names and avatars
  - API routes for listing, inviting, and removing collaborators
  - Server-side ownership enforcement for invitations and removals
  - Read-only access for collaborators in the dialog
  - `Avatar` component installed via shadcn CLI
  - `npm run build` passes with clean TypeScript output
- **Feature 11: Base Canvas** ✓
  - Created shared canvas types in `types/canvas.ts`
  - Implemented `CanvasWrapper` with `LiveblocksProvider`, `RoomProvider`, and `ErrorBoundary`
  - Built collaborative `Canvas` component using `@liveblocks/react-flow` and `@xyflow/react`
  - Configured React Flow with `ConnectionMode.Loose`, `fitView`, `MiniMap`, and dot-pattern background
  - Integrated `CanvasWrapper` and `Canvas` into the workspace page shell
  - Verified `npm run build` passes

- **Feature 12: Shape Panel** ✓
  - Implement bottom shape panel with draggable icons (Rectangle, Diamond, Circle, Pill, Cylinder, Hexagon)
  - Add drag and drop handling to Canvas with React Flow coordinate conversion
  - Implemented node creation on drop via `onNodesChange` with unique IDs
  - Created custom `canvasNode` renderer with handles and selection state
  - Verified `npm run build` passes

## In Progress
- **Feature 13: Node Shape Customization** ✓
  - Replaced placeholder node renderer with proper CSS/SVG shape rendering
  - CSS implementation for Rectangle, Pill, and Circle shapes
  - SVG implementation with non-scaling strokes for Diamond, Hexagon, and Cylinder
  - Implemented ghost drag preview in `ShapePanel` using `setDragImage`
  - Integrated with Liveblocks collaborative state for persistent shape properties
  - Dynamic borders and handles based on selection and hover states
  - Verified `npm run build` passes

- **Feature 14: Node Editing** ✓
  - Added `NodeResizer` to `CanvasNode` with collaborative sync
  - Implemented inline label editing via double-click
  - Integrated label updates with Liveblocks mutations (LiveMap access fixed)
  - Added `nodrag` and `nopan` to prevent canvas interference during editing
  - Subtle resize handles consistent with dark theme
  - Verified `npm run build` passes

- **Feature 15: Node Color Toolbar** ✓
  - Defined `NODE_COLORS` palette in `types/canvas.ts` with 8 predefined pairs
  - Implemented `NodeColorToolbar` with hover glows and active state styling
  - Integrated toolbar into `CanvasNode` (only visible on selection, hidden during editing)
  - Added `updateColors` mutation for collaborative background and text color syncing
  - Updated node rendering to support dynamic background and text colors across all shapes
  - Verified `npm run build` passes

- **Feature 16: Edge Behavior** ✓
  - Added connection handles on all four sides with hover-to-reveal behavior
  - Implemented `CanvasEdge` with `getSmoothStepPath` for right-angle routing
  - Added invisible wider interaction path for improved click targets
  - Built inline label editing using `EdgeLabelRenderer` and path midpoint coordinates
  - Integrated label updates with Liveblocks mutations for collaborative sync
  - Configured `defaultEdgeOptions` with closed arrowheads and custom edge type
  - Verified `npm run build` passes

- **Feature 17: Canvas Ergonomics** ✓
  - Added pill-shaped control bar for zoom and history
  - Integrated zoom controls (in, out, fit view) with React Flow
  - Wired undo/redo buttons to Liveblocks history state
  - Implemented `useKeyboardShortcuts` hook for global shortcuts
  - Supported `+`, `-`, `Ctrl+Z`, `Ctrl+Shift+Z`, `Ctrl+Y` shortcuts
  - Removed MiniMap from canvas
  - Verified `npm run build` passes

## Next Up

- None at this time.

- **UI Polishing: Canvas & Sidebars** ✓
  - Fixed floating canvas visual bug (now edge-to-edge)
  - Implemented floating sidebars that overlap the canvas instead of pushing it
  - Fixed left sidebar "peeking" when closed
  - Resolved drag and drop pipeline issues with useMutation and proper event propagation
  - Updated Liveblocks storage types for TypeScript safety

## Architecture Decisions

- shadcn/ui chosen as the component library per architecture.md; components live in `components/ui/` and must not be modified after installation.
- Tailwind v4 `@theme inline` used to map CSS custom properties to utility classes (no tailwind.config.js needed).
- Dark-only theme: `:root` holds all tokens, `html` element carries the `.dark` class so all shadcn `dark:` variants fire by default.
- Nova preset chosen (Lucide + Geist) — matches project's icon library and font stack.

## Session Notes

- Project is Next.js 16 + React 19 + Tailwind v4. Uses `@import "tailwindcss"` (v4 style).
- components.json is at project root; do not remove or shadcn CLI will break.
- Do not modify `components/ui/*` files — they are generated by shadcn.
