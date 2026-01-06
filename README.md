# Gymnote - Offline-First Workout Tracker

A simple, offline-first Progressive Web App (PWA) for tracking workouts. Built with Nuxt 4, Tailwind CSS, and IndexedDB for reliable offline functionality.

## Features

- **Offline-First**: Works completely offline, syncs automatically when online
- **PWA**: Installable on mobile devices
- **Workout Templates**: Pre-configured workouts (Full Body, Push, Pull, Legs)
- **Automatic Sync**: Seamless cloud sync when internet is available
- **Mobile-First UI**: Clean, simple interface optimized for mobile

## Tech Stack

### Frontend
- Nuxt 4 (Vue 3 Composition API)
- Tailwind CSS
- @vite-pwa/nuxt
- VueUse
- IndexedDB (offline storage)

### Backend
- Nuxt Server Routes (Nitro)
- Neon PostgreSQL
- Prisma ORM

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon PostgreSQL database (or any PostgreSQL database)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gymnote
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database:

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host.region.neon.tech/dbname?sslmode=require"
```

Replace with your actual Neon database connection string.

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Push the database schema:
```bash
npm run db:push
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
gymnote/
├── composables/          # Vue composables
│   ├── useWorkouts.ts   # Workout CRUD operations
│   ├── useSync.ts       # Sync logic
│   ├── useNetwork.ts    # Network detection
│   └── useTemplates.ts  # Workout templates
├── pages/               # Nuxt pages
│   ├── index.vue       # Today's workout
│   ├── history.vue     # Workout history
│   ├── settings.vue    # App settings
│   └── workout/
│       └── [id].vue    # Workout details
├── server/             # API routes
│   └── api/
│       └── workouts/   # Workout endpoints
├── utils/              # Utilities
│   └── db.ts          # IndexedDB wrapper
├── types/             # TypeScript types
├── prisma/           # Prisma schema
└── public/           # Static assets
```

## Core Principles

- **Offline-first over online-first**
- **Simplicity over feature bloat**
- **Local writes are instant**
- **Server sync is eventual & idempotent**
- **Mobile-first UI**

## How It Works

### Offline Storage

All workouts are stored in IndexedDB with the following structure:
- **workouts** - Workout records
- **exercises** - Exercise records
- **sync_queue** - Pending sync operations
- **templates** - Workout templates

### Sync Strategy

1. User creates/edits workout
2. Data saved immediately to IndexedDB
3. Action added to sync queue
4. When online, sync queue processes automatically
5. Local records updated with server IDs
6. Sync status updated (pending → synced)

### Data Model

Each local record includes:
- `localId` - Client-side ID
- `serverId` - Server ID (nullable)
- `syncStatus` - 'pending' | 'synced' | 'failed'

## API Endpoints

- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get single workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

## PWA Features

- Offline cache enabled
- Installable on mobile
- Works in airplane mode
- Background sync
- Service worker registration

## Default Workout Templates

1. **Full Body** - Squat, Bench Press, Bent-Over Row, Plank
2. **Push Day** - Bench Press, Overhead Press, Tricep Dips, Lateral Raises
3. **Pull Day** - Deadlift, Pull-Ups, Barbell Row, Bicep Curls
4. **Leg Day** - Squat, Romanian Deadlift, Lunges, Calf Raises

## Database Schema

```prisma
model Workout {
  id        String     @id @default(uuid())
  date      DateTime
  notes     String?
  exercises Exercise[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Exercise {
  id        String  @id @default(uuid())
  workoutId String
  workout   Workout @relation(fields: [workoutId], references: [id])
  name      String
  sets      Int
  reps      Int
  weight    Float?
  notes     String?
}
```

## Converting Icons

To convert the SVG icons to PNG (required for PWA):

```bash
# Using ImageMagick
convert public/icon-192x192.svg public/icon-192x192.png
convert public/icon-512x512.svg public/icon-512x512.png

# Or use an online converter like:
# - https://cloudconvert.com/svg-to-png
# - https://svgtopng.com/
```

## Contributing

This project follows the "boring, reliable, and solid" philosophy:
- Keep it simple
- Favor clarity over abstraction
- No premature optimization
- No over-engineering

## License

MIT
