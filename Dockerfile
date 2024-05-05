FROM node:18-alpine

ARG VITE_USER_SYSTEM_NAME
ARG VITE_USER_SYSTEM_COLOR
ARG VITE_USER_SYSTEM_ID
ARG VITE_APP_BASE_URL
ARG VITE_BACK_URL

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "preview"]