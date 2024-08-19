# Node.js API Project

This project is a Node.js API that uses PostgreSQL as its database. It is designed to be run in a Docker environment.

## Prerequisites

- Docker or postgresql database
- Node.js
- npm

## Setup

1. **Clone the repository**

    ```
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Copy the .ENV.example file to .ENV**

    ```
    cp .ENV.example .ENV
    ```

3. **Start the PostgreSQL database**

   Run the following command to start the PostgreSQL database using Docker:

    ```
    docker-compose up -d
    ```

4. **Install dependencies**

   Run the following command to install the necessary dependencies:

    ```
    npm install
    ```

5. **Run migrations**

    Set the `DATABASE_URL` environment variable and run the migrations:
    
    Powershell:
    ```
    $env:DATABASE_URL="postgres://postgres:password@localhost:5432/postgres"; npm run migrate up
    ```
   bash:
    ```
    DATABASE_URL=postgres://postgres:password@localhost:5432/postgres npm run migrate up
    ```

## Sources
https://nodejs.org/docs/latest-v21.x/api/index.html

https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/





## Running the API
After completing the setup, you can start the API with the following command:

```
npm run dev
```

This will start the Node.js server and the API will be available at `http://localhost:3000`.

```
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.