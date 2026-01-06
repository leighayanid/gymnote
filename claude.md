# claude.md

## Project: Offline‑First Workout Tracker (PWA)

You are assisting in building a **simple, offline‑first workout tracker PWA** using **Nuxt 4**, **Tailwind CSS**, **Neon (Postgres)**, and **Prisma ORM**.

The app must work fully offline, store data locally, and **automatically sync when internet connectivity is restored**.

---

## Core Principles

- **Offline‑first > online‑first**
- **Simplicity over feature bloat**
- **Local writes are instant**
- **Server sync is eventual & idempotent**
- **Mobile‑first UI**

Avoid unnecessary abstractions, libraries, or over‑engineering.

---

## Tech Stack (Strict)

### Frontend
- Nuxt 4 (App Router)
- Vue 3 Composition API
- Tailwind CSS
- @vite-pwa/nuxt
- VueUse

### Backend
- Nuxt Server Routes (Nitro)
- Neon (PostgreSQL)
- Prisma ORM

### Offline Storage
- IndexedDB (primary)
- localStorage (only for flags / metadata)

---

## Functional Requirements

### Must Have
- Log workouts offline
- Create / edit workouts
- Add exercises with sets, reps, weight
- View workout history
- Auto‑sync when online
- PWA installable on mobile

### Must Not Have (v1)
- Social feed
- AI coaching
- Complex analytics
- Heavy authentication flows

---

## Data Model (Source of Truth)

### Prisma Models

```prisma
model Workout {
  id        String   @id @default(uuid())
  date      DateTime
  notes     String?
  exercises Exercise[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Exercise {
  id        String   @id @default(uuid())
  workoutId String
  name      String
  sets      Int
  reps      Int
  weight    Float?
  notes     String?
}
```

---

## Offline‑First Rules

1. **Never block UI waiting for network**
2. Save all user actions to IndexedDB first
3. Every local record has:
   - `localId`
   - `serverId` (nullable)
   - `syncStatus: pending | synced | failed`
4. Sync runs automatically when online
5. APIs must be idempotent and retry‑safe

---

## Sync Strategy

### Local Tables (IndexedDB)
- workouts
- exercises
- sync_queue

### Sync Flow

1. User creates or edits workout
2. Save immediately to IndexedDB
3. Push action to `sync_queue`
4. Detect network availability
5. Batch sync to `/api/workouts/sync`
6. Update local records with `serverId`

---

## API Rules

- All endpoints must be retry‑safe
- Batch‑based sync only
- No chatty APIs

### Required Endpoints

- `POST /api/workouts/sync`
- `GET /api/workouts`
- `POST /api/workouts`
- `PUT /api/workouts/:id`

---

## UI / UX Guidelines

- White or neutral background
- Large tap targets
- Minimal text
- No gradients
- No complex animations

### Required Pages
- `/` – Today’s workout
- `/history` – Workout history
- `/workout/:id` – Workout details
- `/settings`

---

## Workout Templates (Required Feature)

Workout templates allow users to quickly start common routines **offline**.

### Template Rules
- Stored locally by default
- Can be synced later
- Editable by user
- Simple preset structure

### Template Data Structure

```ts
type WorkoutTemplate = {
  id: string
  name: string
  exercises: {
    name: string
    sets: number
    reps: number
    weight?: number
  }[]
}
```

### Default Templates (Seeded)

#### Full Body
- Squat – 3×10
- Bench Press – 3×8
- Bent‑Over Row – 3×10
- Plank – 3×30s

#### Push Day
- Bench Press – 4×8
- Overhead Press – 3×8
- Tricep Dips – 3×10
- Lateral Raises – 3×12

#### Pull Day
- Deadlift – 3×5
- Pull‑Ups – 3×AMRAP
- Barbell Row – 3×8
- Bicep Curls – 3×12

#### Leg Day
- Squat – 4×6
- Romanian Deadlift – 3×8
- Lunges – 3×10
- Calf Raises – 3×15

### Template UX
- "Start from template" button
- Clones template into a new workout
- Fully editable after creation

---

## PWA Requirements

- App manifest
- Icons: 192×192, 512×512
- Offline cache enabled
- Works with airplane mode

---

## Coding Style Rules

- Prefer composables over stores
- Clear naming over cleverness
- No premature optimization
- No unused dependencies

---

## Definition of Done

- App works fully offline
- Sync works without user interaction
- No data loss when switching networks
- App is installable as PWA
- Codebase is understandable after 30 days

---

## Assistant Behavior

When generating code or suggestions:
- Default to the simplest approach
- Favor clarity over abstraction
- Assume offline usage first
- Avoid speculative features

This project should feel **boring, reliable, and solid**.

