FROM hub.hamdocker.ir/node:16 as builder
WORKDIR /app 
COPY package.json package-lock.json ./
RUN npm install 
COPY . .
CMD ["npm", "run", "start"]