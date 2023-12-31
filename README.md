Daily Diet API 
==============

![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![GitHub stars](https://img.shields.io/github/stars/rauleffting/daily-diet-api?style=flat-square) ![GitHub forks](https://img.shields.io/github/forks/rauleffting/daily-diet-api?style=flat-square) ![GitHub watchers](https://img.shields.io/github/watchers/rauleffting/daily-diet-api?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/rauleffting/daily-diet-api?style=flat-square)

The Daily Diet API is a backend service designed to manage and track daily meals. Built with TypeScript, Node.js, and Fastify, it offers robust features to ensure that meal data is handled efficiently.

Features
--------

*   **Continuous Integration**: Automated CI is set up using GitHub Actions. [View Workflow](https://github.com/rauleffting/daily-diet-api/tree/main/.github/workflows)
*   **Commit Linting**: The repository uses Husky and Commitlint to ensure consistent commit messages.
*   **Database Migrations**: Knex is used for database migrations and configurations.

Setup
-----

1.  Clone the repository.
2.  Install dependencies using `npm install`.
3.  Set up your environment variables based on the `.env.example` and `.env.test.example` files.
4.  Start the server using `npm run dev`.

Routes
------

* `POST - /register`

  Create a new user, receiving email and password in the request body.

* `POST - /login`

  Log in, receiving email and password in the request body.

* `GET - /metrics`

  Show metrics such as total number of registered meals, total number of meals within the diet, and best meals sequency.

* `POST - /meal`

  Create a new meal, receiving name, description, and is_diet_meal in the request body.

* `GET - /meal`

  List all diet records in the database.
 
* `GET - /meal/:id`

  List a specific diet in the database.

* `DELETE - /meal/:id`

  Delete a specific diet in the database.

* `PUT - /meal/:id`

  Update a specific diet in the database.




Contributing
------------

Contributions are welcome! Please ensure that your commit messages adhere to the Commitlint conventions.

License
-------

This project is open-sourced under the MIT License.
