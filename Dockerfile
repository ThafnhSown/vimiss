FROM node:14.21.3-alpine AS build
WORKDIR /app
ADD src /app/src
COPY .babelrc ./
COPY .env.production ./
COPY .npmrc ./
COPY jsconfig.json ./
COPY package.json ./
RUN yarn
RUN yarn build
RUN npm prune --production

FROM node:14.21.3-alpine AS prod
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env.production ./
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
ENV NODE_PATH=./dist
EXPOSE 80
CMD [ "yarn", "start" ]