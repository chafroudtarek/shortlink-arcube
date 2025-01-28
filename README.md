# Arcube URL Shortener

A URL shortening service built with NestJS,

## Frontend Repository

The frontend implementation of this project can be found at: [Frontend Repository](https://github.com/chafroudtarek/front-shortlink-arcube)

Please check out the repository to see the complete user interface.

## Demo Video

<video src="./demo.mp4" controls width="600"></video>

## Features

- URL Shortening
- MongoDB Database
- Docker Support

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB

## Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment Setup:
   Create a `.env` and `.env.docker` files in the root directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/arcube
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

4. Run with Docker:

   ```bash
   npm run docker-start
   ```

   Or run locally:

   ```bash
   npm run start:dev
   ```

## Docker Setup and MongoDB Replica Set Configuration

### Prerequisites

- Docker and Docker Compose installed
- Node.js (v14 or higher)
- Git

### Step-by-Step Setup Instructions

1. **Create MongoDB Configuration Directory and Keyfile**

   ```bash
   # Create mongoconf directory and generate keyfile
   mkdir -p mongoconf
   openssl rand -base64 756 > mongoconf/keyfile.txt
   chmod 400 mongoconf/keyfile.txt
   ```

2. **Create MongoDB Data Directories**

   ```bash
   # Create directories for MongoDB replica set
   mkdir -p db/mongodbmain db/mongodb2 db/mongodb3
   ```

3. **Configure Environment Files**

   Create a `.env.docker` file in the root directory with the following configuration:

4. **Start Docker Containers**

   ```bash
   # Start all containers in detached mode
   docker-compose up -d
   ```

5. **Initialize MongoDB Replica Set**

   ```bash
   # Wait for about 30 seconds after containers are up, then run:
   docker exec mongodbmain /etc/init_mongo_repl.sh
   ```

   This will set up a MongoDB replica set with:

   - Primary node on port 27017
   - Secondary node on port 27018
   - Secondary node on port 27019

   Replica set credentials:

   - Username: admin
   - Password: password123
   - Database: arcube

   Connection string for the replica set:

   ```
   mongodb://admin:password123@localhost:27017,localhost:27018,localhost:27019/arcube?replicaSet=mongoSet&authSource=admin
   ```

### Docker Container Management

```bash
# Start containers
npm run docker-start

# Stop containers
npm run docker-stop

# Restart containers
npm run docker-restart

# View container logs
npm run docker-logs

# Access MongoDB shell
docker exec -it mongodbmain mongosh -u admin -p password123
```

### Verifying the Setup

1. **Check Replica Set Status**

   ```bash
   # Connect to MongoDB shell
   docker exec -it mongodbmain mongosh -u admin -p password123

   # Check replica set status
   rs.status()
   ```

2. **Verify API Service**
   ```bash
   # Test the API endpoint
   curl http://localhost:6003/api/health
   ```

### Troubleshooting

1. **Replica Set Issues**

   - If the replica set initialization fails, try:

     ```bash
     # Restart the containers
     npm run docker-restart

     # Wait 30 seconds, then reinitialize
     docker exec mongodbmain /etc/init_mongo_repl.sh
     ```

2. **Connection Issues**

   - Verify all containers are running:
     ```bash
     docker-compose ps
     ```
   - Check container logs:
     ```bash
     docker-compose logs [service-name]
     ```

3. **Data Persistence**

   - MongoDB data is persisted in the `db/` directory
   - To reset all data:

     ```bash
     # Stop containers
     npm run docker-stop

     # Remove data directories
     rm -rf db/*

     # Recreate directories
     mkdir -p db/mongodbmain db/mongodb2 db/mongodb3

     # Restart containers
     npm run docker-start
     ```

### Development Workflow

1. **Local Development**

   - The API service runs on port 6003
   - MongoDB replica set is accessible on ports 27017, 27018, and 27019
   - Changes to the source code will automatically restart the service

2. **Testing**

   ```bash
   # Run all tests
   npm test

   # Run URL shortener specific tests
   npm run test:shortener

   # Run e2e tests
   npm run test:e2e
   ```

3. **Code Quality**

   ```bash
   # Format code
   npm run format

   # Lint code
   npm run lint
   ```

## API Documentation

### URL Shortener Endpoints

The URL Shortener service provides two main endpoints for creating and accessing shortened URLs.

#### 1. Create Shortened URL

- **Endpoint**: `POST /api/urls/shorten`
- **Description**: Creates a shortened version of a long URL
- **Authentication**: Not required
- **Request Headers**:
  ```
  Content-Type: application/json
  ```
- **Request Body**:

  ```json
  {
    "originalUrl": "https://example.com/very-long-url"
  }
  ```

  - `originalUrl` (string, required)
    - The original URL to be shortened
    - Must be a valid URL format
    - Maximum length: 2000 characters
    - Must include protocol (http:// or https://)

- **Success Response**:

  - **Status**: 201 Created
  - **Body**:
    ```json
    {
      "originalUrl": "https://example.com/very-long-url",
      "shortUrl": "http://yourdomain.com/abc123",
      "shortCode": "abc123"
    }
    ```
    - `originalUrl`: The original URL that was shortened
    - `shortUrl`: The complete shortened URL that can be used to access the original URL
    - `shortCode`: The unique code generated for this URL

- **Error Responses**:
  - **400 Bad Request**:
    ```json
    {
      "statusCode": 400,
      "message": ["Invalid URL format"],
      "error": "Bad Request"
    }
    ```
    Common error cases:
    - URL is missing or empty
    - URL format is invalid
    - URL exceeds maximum length

#### 2. Access Original URL

- **Endpoint**: `GET /api/urls/:shortCode`
- **Description**: Redirects to the original URL associated with the provided short code
- **Authentication**: Not required
- **URL Parameters**:

  - `shortCode` (string, required): The unique code of the shortened URL

- **Success Response**:

  - **Status**: 301 Moved Permanently
  - **Headers**:
    ```
    Location: [Original URL]
    ```
  - Automatically redirects the user to the original URL

- **Error Responses**:
  - **404 Not Found**:
    ```json
    {
      "statusCode": 404,
      "message": "Short URL not found",
      "error": "Not Found"
    }
    ```
    When the provided short code doesn't exist in the system

#### Example Usage

1. Creating a Short URL:

```bash
curl -X POST http://yourdomain.com/api/urls/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url/that/needs/shortening"}'
```

2. Accessing the Original URL:

```bash
curl -L http://yourdomain.com/api/urls/abc123
```

#### Notes

- Short codes are automatically generated and guaranteed to be unique
- URLs are permanently stored unless explicitly deleted
- The service validates URLs before shortening to ensure they are accessible
- Redirects are permanent (301) to allow browsers to cache the redirection

## Project Structure

```
backend/
├── src/
│   ├── v1/
│   │   ├── modules/
│   │   │   ├── urlShortener/    # URL shortening functionality
│   │   │   ├── auth/            # Authentication and authorization
│   │   │   ├── users/           # User management
│   │   │   └── accountVerification/  # Email verification
│   ├── config/                  # Configuration files
│   └── main.ts                  # Application entry point
├── test/                        # Test files
├── scripts/                     # Utility scripts
└── docker-compose.yml           # Docker configuration
```

## Available Scripts

- `npm run start:dev` - Start the application in development mode
- `npm run docker-start` - Start the application with Docker
- `npm run docker-stop` - Stop Docker containers
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run linting
- `npm run build` - Build the application
