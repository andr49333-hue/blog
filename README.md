# CMS Backend

A complete Content Management System (CMS) backend built with Node.js, Express.js, and MongoDB. This system handles both blog posts and stories with full CRUD operations, file uploads, and SEO optimization features.

## Features

- **Content Management**: Create, read, update, and delete blog posts and stories
- **Page Management**: Manage static pages with SEO settings
- **File Uploads**: Image upload support with size and type restrictions
- **SEO Optimization**: Meta titles, descriptions, and keywords for all content
- **Slug Generation**: Automatic URL-friendly slug generation
- **Filtering & Pagination**: Advanced filtering and pagination for content
- **Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with detailed error messages

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **Express-validator**: Input validation
- **Slugify**: URL-friendly slug generation
- **Dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

## Project Structure

```
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   ├── contentController.js  # Content (blog/story) CRUD operations
│   └── pageController.js     # Page CRUD operations
├── middlewares/
│   ├── upload.js            # File upload middleware using multer
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── Content.js           # Content schema (blog/story)
│   └── Page.js             # Page schema
├── routes/
│   ├── contentRoutes.js     # Content API routes
│   └── pageRoutes.js        # Page API routes
├── uploads/                 # Directory for uploaded files
├── .env                     # Environment variables
├── server.js               # Main application entry point
└── package.json            # Project dependencies and scripts
```

## Installation

1. **Clone the repository** (or use the existing project)

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cms-db
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Start MongoDB**:
   Make sure MongoDB is running on your system.

5. **Run the application**:

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Content Endpoints (Blogs & Stories)

| Method | Endpoint             | Description                    | Body/Query Parameters                                                                                                              |
| ------ | -------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/content`       | Create new content             | `{ type, title, content, author, publicationDate, status?, slug?, metaTitle?, metaDescription?, keywords? }` + optional image file |
| GET    | `/api/content`       | Get all content with filtering | Query: `type?, status?, author?, page?, limit?, sort?`                                                                             |
| GET    | `/api/content/:slug` | Get single content by slug     | -                                                                                                                                  |
| PUT    | `/api/content/:slug` | Update content                 | Same as POST (all fields optional) + optional image file                                                                           |
| DELETE | `/api/content/:slug` | Delete content                 | -                                                                                                                                  |

### Page Endpoints

| Method | Endpoint           | Description             | Body/Query Parameters                                                                               |
| ------ | ------------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| POST   | `/api/pages`       | Create new page         | `{ pageTitle, slug?, metaTitle?, metaDescription?, keywords?, googleAnalyticsId?, metaPixelCode? }` |
| GET    | `/api/pages`       | Get all pages           | Query: `page?, limit?, sort?`                                                                       |
| GET    | `/api/pages/:slug` | Get single page by slug | -                                                                                                   |
| PUT    | `/api/pages/:slug` | Update page             | Same as POST (all fields optional)                                                                  |
| DELETE | `/api/pages/:slug` | Delete page             | -                                                                                                   |

### Health Check

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/api/health` | Check API status |

## Usage Examples

### Create a Blog Post

```bash
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "author": "John Doe",
    "publicationDate": "2023-12-26T10:00:00.000Z",
    "status": "published",
    "metaTitle": "My First Blog - SEO Title",
    "metaDescription": "This is a sample blog post for demonstration",
    "keywords": ["blog", "tutorial", "nodejs"]
  }'
```

### Upload Image with Content

```bash
curl -X POST http://localhost:5000/api/content \
  -F "type=blog" \
  -F "title=Blog with Image" \
  -F "content=This blog has an image..." \
  -F "author=Jane Doe" \
  -F "publicationDate=2023-12-26T10:00:00.000Z" \
  -F "image=@/path/to/image.jpg"
```

### Get Filtered Content

```bash
# Get all published blogs
curl "http://localhost:5000/api/content?type=blog&status=published"

# Get stories by specific author with pagination
curl "http://localhost:5000/api/content?type=story&author=John&page=1&limit=5"

# Get content sorted by publication date
curl "http://localhost:5000/api/content?sort=-publicationDate"
```

### Create a Page

```bash
curl -X POST http://localhost:5000/api/pages \
  -H "Content-Type: application/json" \
  -d '{
    "pageTitle": "About Us",
    "metaTitle": "About Our Company",
    "metaDescription": "Learn more about our company and mission",
    "keywords": ["about", "company", "mission"],
    "googleAnalyticsId": "GA-12345-1"
  }'
```

## Data Models

### Content Model (Blog/Story)

```javascript
{
  type: String,           // 'blog' or 'story'
  title: String,          // Content title
  slug: String,           // Auto-generated URL-friendly identifier
  content: String,        // Main content body
  status: String,         // 'draft' or 'published'
  author: String,         // Content author
  publicationDate: Date,  // Publication date
  image: String,          // Image filename (optional)
  metaTitle: String,      // SEO meta title (optional)
  metaDescription: String, // SEO meta description (optional)
  keywords: [String],     // SEO keywords (optional)
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Page Model

```javascript
{
  pageTitle: String,      // Page title
  slug: String,           // Auto-generated URL-friendly identifier
  metaTitle: String,      // SEO meta title (optional)
  metaDescription: String, // SEO meta description (optional)
  keywords: [String],     // SEO keywords (optional)
  googleAnalyticsId: String, // GA tracking ID (optional)
  metaPixelCode: String,  // Facebook Pixel code (optional)
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

## Features in Detail

### Automatic Slug Generation

- Slugs are automatically generated from titles using the `slugify` package
- Duplicate slugs are handled by appending numbers (e.g., "my-title-1", "my-title-2")
- Manual slug override is supported

### File Upload

- Accepts PNG and JPG images only
- Maximum file size: 5MB
- Files are stored in the `/uploads` directory
- Unique filenames prevent conflicts

### Validation

- Comprehensive input validation using express-validator
- Required field validation
- Length limits for text fields
- Format validation for special fields (GA IDs, dates, etc.)

### Error Handling

- Centralized error handling middleware
- Detailed error messages for different scenarios
- Proper HTTP status codes
- Development vs production error responses

### Filtering & Pagination

- Filter content by type, status, author, publication date
- Pagination with configurable page size
- Sorting by any field (ascending/descending)
- Total count and pagination metadata in responses

## Environment Configuration

| Variable        | Description                   | Default                          |
| --------------- | ----------------------------- | -------------------------------- |
| `PORT`          | Server port                   | 5000                             |
| `MONGODB_URI`   | MongoDB connection string     | mongodb://localhost:27017/cms-db |
| `NODE_ENV`      | Environment mode              | development                      |
| `JWT_SECRET`    | JWT secret for authentication | -                                |
| `UPLOAD_PATH`   | Upload directory path         | ./uploads                        |
| `MAX_FILE_SIZE` | Maximum file size in bytes    | 5242880 (5MB)                    |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License
