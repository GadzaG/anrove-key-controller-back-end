FROM node:22.2.0 as build

WORKDIR /app

COPY package*.json .

RUN npm i
COPY . .

RUN npx prisma db push

RUN npm run build




# 
FROM nginx
COPY --from=build /app/.nginx/ngnix.conf /etc/nginx/sites-enabled/default
CMD [ "nginx", "-g", "deamon off;" ]
