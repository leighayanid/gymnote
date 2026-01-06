# Gymnote - Production-Ready Offline-First Workout Tracker

A production-ready, secure, and fully-tested Progressive Web App (PWA) for tracking workouts. Built with Nuxt 3, TypeScript, Tailwind CSS, and IndexedDB for reliable offline functionality.

## Features

### Core Features
- **Offline-First**: Works completely offline, syncs automatically when online
- **PWA**: Installable on mobile devices
- **Workout Templates**: Pre-configured workouts (Full Body, Push, Pull, Legs)
- **Automatic Sync**: Seamless cloud sync with retry logic
- **Mobile-First UI**: Clean, responsive interface optimized for mobile

### Production Features
- **Real Authentication**: JWT-based authentication with secure password hashing (bcrypt)
- **Input Validation**: Comprehensive Zod schemas for all API endpoints
- **Rate Limiting**: Protection against abuse with configurable limits
- **Security Headers**: CORS, XSS, and other security protections enabled
- **Error Tracking**: Structured logging with Pino
- **Data Export/Import**: Full backup and restore capabilities (JSON/CSV)
- **Pagination**: Efficient handling of large datasets
- **Testing**: Unit, integration, and E2E tests with Vitest & Playwright
- **Analytics**: Performance and error monitoring infrastructure
- **API Documentation**: Complete REST API documentation

## Tech Stack

### Frontend
- **Nuxt 3** (Vue 3 Composition API)
- **TypeScript** (full type safety)
- **Tailwind CSS** (styling)
- **@vite-pwa/nuxt** (PWA support)
- **VueUse** (composition utilities)
- **IndexedDB** (offline storage)
- **GSAP** (animations)

### Backend
- **Nuxt Server Routes** (Nitro)
- **PostgreSQL** (via Neon)
- **Prisma ORM** (database access)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)
- **Zod** (validation)
- **Pino** (structured logging)

### Testing
- **Vitest** (unit & integration tests)
- **Playwright** (E2E tests)
- **@vue/test-utils** (component testing)
- **Coverage Reports** (v8)

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

3. Set up your environment:

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Update the `.env` file with your values:
```env
# Database
DATABASE_URL="postgresql://user:password@host.region.neon.tech/dbname?sslmode=require"

# JWT Secret (IMPORTANT: Generate a strong secret!)
JWT_SECRET="your-super-secret-key-min-32-characters"

# Application
NODE_ENV="development"
LOG_LEVEL="debug"
```

**IMPORTANT:** Generate a strong JWT secret:
```bash
openssl rand -base64 64
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Or for development (without migrations)
npm run db:push
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Testing

```bash
# Run all unit tests
npm run test

# Run unit tests once
npm run test:unit

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

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

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Invalidate session
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Workouts
- `GET /api/workouts` - Get all workouts (paginated, requires auth)
- `POST /api/workouts` - Create workout (requires auth)
- `GET /api/workouts/:id` - Get single workout (requires auth)
- `PUT /api/workouts/:id` - Update workout (requires auth)
- `DELETE /api/workouts/:id` - Delete workout (requires auth)

### Data Management
- `GET /api/data/export` - Export all data (JSON/CSV, requires auth)
- `POST /api/data/import` - Import workouts (requires auth)

### Feedback
- `POST /api/feedback` - Submit user feedback

**For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

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
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String    // hashed with bcrypt
  name      String
  workouts  Workout[]
  sessions  Session[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  token        String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  lastActiveAt DateTime @default(now())
}

model Workout {
  id        String     @id @default(uuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id])
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

## Production Checklist

Before deploying to production:

- [ ] Generate a strong JWT_SECRET
- [ ] Set up a PostgreSQL database (Neon, Supabase, etc.)
- [ ] Configure all environment variables
- [ ] Run database migrations
- [ ] Run all tests (`npm run test:unit` and `npm run test:e2e`)
- [ ] Build and test production build locally
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure backups
- [ ] Enable HTTPS
- [ ] Review security headers
- [ ] Set up monitoring/alerts

## Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Input Validation**: Zod schemas on all endpoints
- **Rate Limiting**: Configurable per-endpoint limits
- **Security Headers**: XSS, CSRF, clickjacking protection
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **Session Management**: Token expiration and cleanup

## Performance Features

- **Pagination**: Efficient data loading for large datasets
- **Database Indexing**: Optimized queries with proper indexes
- **Code Splitting**: Lazy-loaded routes and components
- **Image Optimization**: WebP support and lazy loading
- **Caching**: Service worker caching for offline support
- **Compression**: Gzip/Brotli compression enabled

## Monitoring & Analytics

The app includes infrastructure for:
- Performance monitoring (Core Web Vitals)
- Error tracking (structured logging)
- User analytics (page views, actions)
- API monitoring (response times, error rates)

## Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete REST API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions

## Contributing

This project follows production-ready best practices:
- **Code Quality**: TypeScript for type safety
- **Testing**: Comprehensive test coverage
- **Security**: Industry-standard security practices
- **Documentation**: Well-documented code and APIs
- **Performance**: Optimized for speed and efficiency

When contributing:
1. Write tests for new features
2. Follow TypeScript best practices
3. Update documentation
4. Ensure all tests pass
5. Follow existing code style

## Support

- **Issues**: GitHub Issues
- **Email**: support@gymnote.app (example)
- **Documentation**: See `/docs` folder

## License

MIT
