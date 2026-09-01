FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN mkdir -p /app/data
RUN npm run build
EXPOSE 3004
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
