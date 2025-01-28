FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install bash and curl (if needed)
RUN apk add --no-cache bash curl

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install



# Copy the rest of the files
COPY . ./

# Expose the application port
EXPOSE 6003

# Set entrypoint
ENTRYPOINT ["npm", "run", "start:dev"]
