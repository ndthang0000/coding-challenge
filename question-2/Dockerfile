FROM node:20.11.1-alpine3.18

RUN apk add git

WORKDIR /app
ARG BUILD_ENV
COPY . .

RUN npm ci
RUN npm run build

# DOWNLOAD THE FILE FROM THE URL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
RUN wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

# REPLACE THE FILE IN dist/modules/@core/infrastructure/mongoose/rds-combined-ca-bundle.pem
RUN cp global-bundle.pem dist/@core/infrastructure/mongoose/rds-combined-ca-bundle.pem

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
