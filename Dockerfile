# BUILD
FROM node:22.2.0 as build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g npm@10.8.1
RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build


# START
FROM node:22.2.0
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

EXPOSE 4200
CMD ["npm", "run", "start:prod"]


# NGINX
# FROM nginx
# COPY --from=build /app/.nginx/ngnix.conf /etc/nginx/sites-enabled/default
# CMD [ "nginx", "-g", "deamon off;" ]
