# Create a build of the project
FROM node:20 AS build
WORKDIR /build

# Copy package.json and yarn.lock first to leverage Docker caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Now copy the rest of the application files
COPY . .

# Build the application
RUN yarn run build

# Copy the build artifacts
FROM node:20
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /build .

# Run the app
ENTRYPOINT ["yarn", "start"]
