Daily Diet API
==============

![GitHub stars](https://img.shields.io/github/stars/rauleffting/daily-diet-api?style=flat-square) ![GitHub forks](https://img.shields.io/github/forks/rauleffting/daily-diet-api?style=flat-square) ![GitHub watchers](https://img.shields.io/github/watchers/rauleffting/daily-diet-api?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/rauleffting/daily-diet-api?style=flat-square)

The Daily Diet API is a backend service designed to manage and track daily meals. Built with TypeScript, it offers a robust set of features to ensure that meal data is handled efficiently.

Features
--------

*   **Endpoint Updates**: The API recently added an `updated_at` parameter to the edit meal endpoint. [View Commit](https://github.com/rauleffting/daily-diet-api/commit/64932b4248cacb9456eb1b5e6478a5a28256a457)
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

* * *

Note: This is a basic README based on the available information from the GitHub repository. You might want to add more details, such as API endpoints, usage examples, and more, based on the actual functionality and design of the API.
