FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
#COPY ./.env-docker ./.env

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

#ENV DATABASE_URL="postgresql://admin:admin@db:5432/brain?schema=public"

#CMD ["node", "dist/main"]
CMD ["npm", "run", "start:migrate:prod"]
