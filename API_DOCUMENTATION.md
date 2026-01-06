# Gymnote API Documentation

## Table of Contents

1. [Authentication](#authentication)
2. [Workouts](#workouts)
3. [Data Management](#data-management)
4. [Feedback](#feedback)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### POST `/api/auth/signup`

Create a new user account.

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Errors:**
- `400` - Validation failed
- `409` - User with this email already exists
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### POST `/api/auth/login`

Authenticate an existing user.

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Errors:**
- `400` - Validation failed
- `401` - Invalid email or password
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### POST `/api/auth/refresh`

Refresh an access token using a refresh token.

**Rate Limit:** 30 requests per minute

**Request Body:**
```json
{
  "token": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
  "accessToken": "new_jwt_access_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - Validation failed
- `401` - Invalid or expired refresh token
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### POST `/api/auth/logout`

Invalidate a refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`

Get the current authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `401` - Unauthorized
- `500` - Internal server error

---

## Workouts

### GET `/api/workouts`

Get all workouts for the authenticated user with pagination.

**Rate Limit:** 100 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Items per page

**Response (200):**
```json
{
  "workouts": [
    {
      "id": "uuid",
      "userId": "uuid",
      "date": "2024-01-01T00:00:00.000Z",
      "notes": "Great workout!",
      "exercises": [
        {
          "id": "uuid",
          "workoutId": "uuid",
          "name": "Bench Press",
          "sets": 3,
          "reps": 10,
          "weight": 135,
          "notes": "Felt strong"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

**Errors:**
- `401` - Unauthorized
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### POST `/api/workouts`

Create a new workout.

**Rate Limit:** 30 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "Great workout!",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 3,
      "reps": 10,
      "weight": 135,
      "notes": "Felt strong"
    },
    {
      "name": "Squats",
      "sets": 4,
      "reps": 8,
      "weight": 225
    }
  ]
}
```

**Validation Rules:**
- `date` - Required, valid datetime
- `notes` - Optional, max 1000 characters
- `exercises` - Required, at least 1 exercise
  - `name` - Required, max 200 characters
  - `sets` - Required, integer, min 1, max 100
  - `reps` - Required, integer, min 1, max 1000
  - `weight` - Optional, number, min 0, max 10000
  - `notes` - Optional, max 500 characters

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "Great workout!",
  "exercises": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400` - Validation failed
- `401` - Unauthorized
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### GET `/api/workouts/:id`

Get a specific workout by ID.

**Rate Limit:** 100 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "Great workout!",
  "exercises": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400` - Invalid workout ID
- `401` - Unauthorized
- `404` - Workout not found
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### PUT `/api/workouts/:id`

Update an existing workout.

**Rate Limit:** 30 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "Updated notes",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 4,
      "reps": 12,
      "weight": 145,
      "notes": "Increased weight"
    }
  ]
}
```

**Note:** When exercises are provided, all existing exercises are replaced.

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "Updated notes",
  "exercises": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `400` - Validation failed
- `401` - Unauthorized
- `404` - Workout not found
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### DELETE `/api/workouts/:id`

Delete a workout.

**Rate Limit:** 30 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Workout deleted successfully"
}
```

**Errors:**
- `400` - Invalid workout ID
- `401` - Unauthorized
- `404` - Workout not found
- `429` - Rate limit exceeded
- `500` - Internal server error

---

## Data Management

### GET `/api/data/export`

Export all user data.

**Rate Limit:** 10 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `format` (optional, default: json) - Export format: `json` or `csv`

**Response (200) - JSON:**
```json
{
  "exportDate": "2024-01-01T00:00:00.000Z",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  },
  "workouts": [...],
  "totalWorkouts": 50,
  "totalExercises": 200
}
```

**Response (200) - CSV:**
```csv
Date,Exercise,Sets,Reps,Weight,Notes
2024-01-01,Bench Press,3,10,135,"Felt strong"
2024-01-01,Squats,4,8,225,""
```

**Headers (CSV):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="gymnote-export-{timestamp}.csv"
```

**Errors:**
- `401` - Unauthorized
- `429` - Rate limit exceeded
- `500` - Internal server error

---

### POST `/api/data/import`

Import workout data.

**Rate Limit:** 10 requests per minute

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "workouts": [
    {
      "date": "2024-01-01T00:00:00.000Z",
      "notes": "Great workout!",
      "exercises": [
        {
          "name": "Bench Press",
          "sets": 3,
          "reps": 10,
          "weight": 135,
          "notes": "Felt strong"
        }
      ]
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully imported 10 workouts",
  "imported": 10
}
```

**Errors:**
- `400` - Invalid import data format
- `401` - Unauthorized
- `429` - Rate limit exceeded
- `500` - Internal server error

---

## Feedback

### POST `/api/feedback`

Submit user feedback.

**Rate Limit:** 10 requests per minute

**Headers (optional):**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "type": "bug",
  "subject": "Login issue",
  "message": "I'm having trouble logging in on mobile devices...",
  "email": "user@example.com"
}
```

**Fields:**
- `type` - Required, one of: `bug`, `feature`, `general`
- `subject` - Required, min 5 characters, max 200 characters
- `message` - Required, min 10 characters, max 5000 characters
- `email` - Optional (required if not authenticated), valid email

**Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your feedback! We appreciate your input."
}
```

**Errors:**
- `400` - Validation failed
- `429` - Rate limit exceeded
- `500` - Internal server error

---

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email address"
      }
    ]
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

All endpoints are rate limited to prevent abuse. Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200000
```

### Rate Limit Presets

- **Strict** (10 requests/minute): Export, Import, Feedback
- **Auth** (5 requests/minute): Signup, Login
- **Moderate** (30 requests/minute): Create, Update, Delete operations
- **Lenient** (100 requests/minute): Read operations

When rate limit is exceeded, the API returns:

```json
{
  "statusCode": 429,
  "statusMessage": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later."
}
```

---

## Best Practices

1. **Always validate input on the client side** before sending requests
2. **Store refresh tokens securely** (HttpOnly cookies or secure storage)
3. **Implement exponential backoff** for failed requests
4. **Cache responses** when appropriate to reduce API calls
5. **Handle errors gracefully** and provide user-friendly messages
6. **Use pagination** for large datasets
7. **Respect rate limits** to avoid temporary bans
8. **Include request IDs** in error reports for debugging

---

## Support

For API support or to report issues:
- Submit feedback via `/api/feedback`
- Email: support@gymnote.app (example)
- GitHub: [repository issues](https://github.com/yourusername/gymnote/issues)
