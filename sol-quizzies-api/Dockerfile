FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn 

COPY . .
# Build
RUN npx prisma generate
RUN yarn build

### Build production image

FROM node:18-alpine as prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/yarn.lock ./
COPY .env* ./
COPY prisma ./
EXPOSE 8080

RUN yarn install --frozen-lockfile --production
RUN npx prisma generate
CMD ["node", "dist/main"]