# 1. Use an official Node.js image as the base image
FROM node:16 as build

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the source code into the working directory
COPY . .

# 6. Build the React app for production
RUN npm run build

# # 7. Use a lightweight web server to serve the built app
# FROM nginx:alpine

# # 8. Copy the build files from the previous step into the web server's default directory
# COPY --from=build /app/build /usr/share/nginx/html

# # 9. Expose port 80 so the container can accept requests
# EXPOSE 80

# # 10. Command to start the web server
# CMD ["nginx", "-g", "daemon off;"]
