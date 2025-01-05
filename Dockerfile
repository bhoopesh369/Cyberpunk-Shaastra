FROM node:18-slim

# Install dependencies for building native modules and libvips for sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    autoconf \
    automake \
    zlib1g-dev \
    libpng-dev \
    nasm \
    bash \
    libvips-dev \
    git \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set environment variables
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /opt/

# Copy package files and install dependencies
COPY package.json yarn.lock ./

# Install node-gyp globally for native module builds
RUN yarn global add node-gyp

# Increase network timeout and install dependencies
RUN yarn config set network-timeout 600000 -g && yarn install --frozen-lockfile

# Update PATH to include node_modules binaries
ENV PATH=/opt/node_modules/.bin:$PATH

# Set the app directory and copy the project files
WORKDIR /opt/app
COPY . .

# Change ownership to the `node` user
RUN chown -R node:node /opt/app

# Switch to non-root user for security
USER node

# Build the project
RUN yarn build

# Expose the default Strapi port
EXPOSE 1337

# Start the development server
CMD ["yarn", "develop" "--watch-admin"]
