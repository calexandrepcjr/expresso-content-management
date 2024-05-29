# expresso-content-management

Playing with express to deliver a basic CMS that returns blog posts

## Design

Inspired by [Clean Architecture](https://www.amazon.com.br/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

## How to run the application

Guarantee you have installed both Docker and Docker Composer and run:

`docker compose up`

## How to see the endpoints

The Swagger UI is at `http://localhost:3000/api-docs`

## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm test`

Run all tests - considering that express-zod-api does not offer any inversion of control regarding the Express App, for practical purposes we bounded the Supertest to `http://localhost:3000` - in this case, you need to run the container with `docker compose up` or the application locally with `npm run dev` prior running the tests for now.

### `npm test -- testfile`

Run a single test.

### `npm run lint`

Check for linting errors.

### npm run build:docs

Generates OpenAPI documentation. Executes automatically when executing `npm run dev`.

### `npm start`

Run the production build

