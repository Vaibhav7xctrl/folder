FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Copy connection profile and certificates
COPY connection.json .
COPY wallet/ ./wallet/

EXPOSE 4000
CMD ["npm", "start"] 