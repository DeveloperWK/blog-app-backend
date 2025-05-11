# Blog App Backend

## Overview

This is the backend for a blog application built using Node.js, Express, and MongoDB. It provides APIs for user authentication, blog post management, comments, reactions, and more. The application is designed with scalability and security in mind, utilizing features like JWT authentication, Redis caching, and rate limiting.

## Features

- **User Authentication**: Register, login, and manage users with JWT-based authentication.
- **Two-Factor Authentication (2FA)**: Optional 2FA for enhanced security.
- **Blog Management**: Create, update, delete, and search blog posts.
- **Comments and Reactions**: Add comments and reactions to blog posts.
- **Category Management**: Organize blog posts into categories.
- **Bookmarking**: Bookmark blog posts for later reference.
- **Admin Features**: Manage users and comments.
- **Caching**: Redis caching for improved performance.
- **File Uploads**: Image uploads using ImageKit.
- **Rate Limiting**: Protect APIs with rate limiting using `node-api-guard`.

## Project Structure

```
package.json
README.md
webpack.config.js
src/
  app.js
  server.js
  config/
    database.config.js
    imagekit.config.js
    multer.config.js
    nodemailer.config.js
    redisClient.config.js
  controllers/
    admins/
      admin.controller.js
    auth/
      auth.controller.js
      auth.validator.js
    blogPosts/
      blogPost.controller.js
      blogPost.validator.js
    bookMarks/
      bookMark.controller.js
    categories/
      category.controller.js
    comments/
      comment.controller.js
      comment.validator.js
    reactions/
      reaction.controller.js
    users/
      user.controller.js
  middleware/
    auth.middleware.js
    error.middleware.js
    notFound.middleware.js
    RBAC/
      rbac.middleware.js
  models/
    BlogPost.model.js
    BookMark.model.js
    category.model.js
    Comment.model.js
    User.model.js
  routes/
    admin.route.js
    auth.route.js
    blogPost.route.js
    bookMarkRoute.route.js
    category.route.js
    comment.route.js
    reaction.route.js
    user.route.js
  services/
    image-upload.service.js
    reset-pass-link.service.js
    sendLoginNotification.service.js
    twoFactorAuth.service.js
    user-welcome-mail.service.js
    verifyOtpSend.service.js
  utils/
    cookie.js
    deleteBlogPostKeysFromRedis.js
    generateOtp.js
    generateToken.js
    hash.js
    loginInfo.js
    parseUserAgent.js
    redisUtility.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blog-app-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   HASH_KEY=<your-hash-key>
   IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
   IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
   IMAGEKIT_URL_ENDPOINT=<your-imagekit-url-endpoint>
   SMTP_HOST=<your-smtp-host>
   SMTP_PORT=<your-smtp-port>
   SMTP_USERNAME=<your-smtp-username>
   SMTP_PASSWORD=<your-smtp-password>
   SMTP_SECURE=<true-or-false>
   CLIENT_URL=<your-client-url>
   REDIS_URL=<your-redis-url>
   ```

## Scripts

- `npm run dev`: Start the development server with `nodemon`.
- `npm run start`: Start the production server.
- `npm run build`: Build the project using Webpack.
- `npm run lint`: Run ESLint to check for code quality issues.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login a user.
- `POST /api/v1/auth/verify`: Verify OTP.
- `POST /api/v1/auth/two-factor-auth`: Verify 2FA OTP.
- `POST /api/v1/auth/resend-otp`: Resend OTP.
- `POST /api/v1/auth/reset-password-link`: Send password reset link.
- `PATCH /api/v1/auth/forgot-password`: Reset password.
- `PATCH /api/v1/auth/change-password`: Change password.

### Blog Posts

- `POST /api/v1/blog-post`: Create a new blog post.
- `GET /api/v1/blog-post`: Get all blog posts.
- `GET /api/v1/blog-post/:id`: Get a single blog post by ID.
- `PATCH /api/v1/blog-post/:id`: Update a blog post.
- `DELETE /api/v1/blog-post/:id`: Delete a blog post.

### Comments

- `POST /api/v1/comments`: Add a comment.
- `GET /api/v1/comments/:blogId`: Get comments for a blog post.
- `PATCH /api/v1/comments/:id`: Update a comment.
- `DELETE /api/v1/comments/:id`: Delete a comment.

### Categories

- `POST /api/v1/categories`: Create a category.
- `GET /api/v1/categories`: Get all categories.
- `PATCH /api/v1/categories/:id`: Update a category.
- `DELETE /api/v1/categories/:id`: Delete a category.

### Reactions

- `POST /api/v1/reactions/:blogId`: Add a reaction to a blog post.
- `GET /api/v1/reactions/:blogId`: Get reactions for a blog post.

### Bookmarks

- `POST /api/v1/bookmark`: Add a bookmark.
- `GET /api/v1/bookmark/:userId`: Get all bookmarks for a user.
- `DELETE /api/v1/bookmark/:blogId`: Remove a bookmark.

### Admin

- `GET /api/v1/admin/users`: Get all users.
- `GET /api/v1/admin/comments`: Get all comments.

## Middleware

- **Authentication**: `auth.middleware.js` for JWT-based authentication.
- **RBAC**: Role-based access control using `rbac.middleware.js`.
- **Error Handling**: Centralized error handling with `error.middleware.js`.
- **Not Found**: Handle 404 errors with `notFound.middleware.js`.

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT and 2FA (Speakeasy)
- **Caching**: Redis
- **File Uploads**: Multer and ImageKit
- **Email Service**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS, and `node-api-guard`

## License

This project is licensed under the MIT License.
