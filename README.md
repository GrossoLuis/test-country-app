# Country Info Application

This application provides information about countries, including their border countries and population data.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies for both backend and frontend:

    ```bash
    cd country-info-backend
    npm install

    cd ../country-info-frontend
    npm install
    ```

## Configuration

1. **Backend:**

    - Create a `.env` file in the `country-info-backend` directory with the following content:

    ```plaintext
    PORT=3001
    DATE_NAGER_API=https://date.nager.at/api/v3
    COUNTRIES_NOW_API=https://countriesnow.space/api/v0.1
    ```

2. **Frontend:**

    - Create a `.env.local` file in the `country-info-frontend` directory with the following content:

    ```plaintext
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    ```

## Running the Application

1. Start the backend server:

    ```bash
    cd country-info-backend
    npm run dev
    ```

2. Start the frontend development server:

    ```bash
    cd country-info-frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

