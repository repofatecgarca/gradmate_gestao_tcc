FROM node:18
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]