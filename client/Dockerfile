# 🔥 BASE IMAGE
FROM node:22

# 🔥 WORK DIRECTORY
WORKDIR /app

# 🔥 COPY PACKAGE FILES
COPY package*.json ./

# 🔥 INSTALL DEPENDENCIES
RUN npm install

# 🔥 COPY PROJECT FILES
COPY . .

# 🔥 BUILD REACT APP
RUN npm run build

# 🔥 INSTALL STATIC SERVER
RUN npm install -g serve

# 🔥 EXPOSE PORT
EXPOSE 5173

# 🔥 SERVE BUILD
CMD ["serve", "-s", "dist", "-l", "5173"]