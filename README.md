# Twitter Clone API

A lightweight Node.js + Express backend that mirrors core Twitter functionality with JWT authentication and a PostgreSQL data store. The service includes user registration/login, posting and retrieving tweets, and following/unfollowing users, making it a solid starting point for a social feed or portfolio demo.

## Features
- **Authentication**: Register and log in with hashed passwords and JWT-based session tokens.
- **Tweeting**: Create tweets (up to 280 characters), fetch all tweets in reverse-chronological order, or retrieve a single tweet by ID.
- **Social graph**: Follow or unfollow other users, with safeguards against self-follows and duplicate relationships.
- **Validation & security**: Joi request validation, CORS enabled, and error-handling middleware for 404/500 responses.

## Project structure
- `app.js` – Express app setup, middleware, and route mounting.
- `routes/` – Auth, tweet, and follow route definitions.
- `controllers/` – Request handlers for authentication, tweets, and follows.
- `middleware/` – JWT authentication and request validation helpers.
- `models/db.js` – PostgreSQL connection (using the `postgres` driver).

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database instance

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment** – create a `.env` file in the project root:
   ```env
   PORT=3000
   JWT_SECRET=super-secret-jwt-key
   PGHOST=your-db-host
   PGDATABASE=your-db-name
   PGUSER=your-db-username
   PGPASSWORD=your-db-password
   ENDPOINT_ID=optional-neon-endpoint-id
   ```
   > `ENDPOINT_ID` is only needed if you use Neon or another provider that requires a project/endpoint option.
3. **Create tables** – run SQL similar to the following to bootstrap your database:
   ```sql
   CREATE TABLE Users (
     UserID SERIAL PRIMARY KEY,
     Username VARCHAR(255) NOT NULL UNIQUE,
     Email VARCHAR(255) NOT NULL UNIQUE,
     PasswordHash VARCHAR(255) NOT NULL
   );

   CREATE TABLE Tweets (
     TweetID SERIAL PRIMARY KEY,
     UserID INT NOT NULL REFERENCES Users(UserID),
     Content VARCHAR(280) NOT NULL,
     ImageURL TEXT,
     ParentTweetID INT REFERENCES Tweets(TweetID),
     CreationDate TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE TABLE Follows (
     FollowerID INT NOT NULL REFERENCES Users(UserID),
     FollowingID INT NOT NULL REFERENCES Users(UserID),
     FollowDate TIMESTAMPTZ DEFAULT NOW(),
     PRIMARY KEY (FollowerID, FollowingID)
   );
   ```
4. **Run the server**
   ```bash
   node app.js
   ```
   The API will start on `http://localhost:3000` (configurable via `PORT`).

## API overview
All protected endpoints expect an `Authorization: Bearer <token>` header containing the JWT returned from `/api/auth/login`.

### Auth
- `POST /api/auth/register` – body: `{ username, email, password }`
- `POST /api/auth/login` – body: `{ email, password }` → returns `{ token }`

### Tweets (authenticated)
- `POST /api/tweets` – body: `{ userId, content, imageUrl?, parentTweetId? }`
- `GET /api/tweets` – list all tweets (newest first)
- `GET /api/tweets/:id` – fetch a single tweet by ID

### Follows (authenticated)
- `POST /api/follow/follow` – body: `{ followerId, followingId }`
- `POST /api/follow/unfollow` – body: `{ followerId, followingId }`

## Development tips
- Adjust CORS settings in `app.js` if you host a separate frontend.
- Update `JWT_SECRET` and database credentials before deploying publicly.
- Consider adding rate limiting, pagination, and integration tests before production use.
