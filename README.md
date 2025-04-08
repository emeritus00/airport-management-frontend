# Airport Management System

A React-based web app for managing aviation data (aircraft, airports, cities, passengers) with CRUD operations via a RESTful API.

## Features

- CRUD operations for Aircrafts, Airports, Cities, Passengers
- Search by specific fields (e.g., airline name)
- Responsive UI with Tailwind CSS
- Error handling for API failures
- Unit tests with Jest and React Testing Library

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library, `@testing-library/jest-dom`
- **Environment**: Node.js, Create React App

## Installation (Step-by-Step)

## Clone or Create Project

### Clone

```bash
git clone https://github.com/your-username/airport-management-system.git
cd airport-management-system
```

### Or Create

```bash
npx create-react-app airport-management-system
cd airport-management-system
npm install axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Edit tailwind.config.js:
  ```js
  module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: { extend: {} },
    plugins: [],
  };
  ```
- Update src/index.css
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### Install Dependencies

- Run

```bash
npm install
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

- Verify

```json
{
  "dependencies": {
    "axios": "*",
    "react": "*",
    "tailwindcss": "*",
    "postcss": "*",
    "autoprefixer": "*"
  },
  "devDependencies": {
    "@testing-library/react": "*",
    "@testing-library/jest-dom": "*"
  },
  "scripts": {
    "start": "react-scripts start",
    "test": "react-scripts test"
  }
}
```

### Run the App

- Execute

```bash
npm start
```

### Run Tests

- Execute

```bash
npm test

```
