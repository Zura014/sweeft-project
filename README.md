# Recipe Sharing Application

This project is a Recipe Sharing Application built with **Angular** for the frontend and **json-server** as a mock backend. The app allows users to view, add, edit, and delete recipes with an easy-to-use interface.

Available at https://sweeft-project-alpha.vercel.app/

### Note: Since this application uses a free-tier backend hosting service on Render, the server may need a few minutes to boot up if it has been inactive. Please be patient during the initial load.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Folder Structure](#folder-structure)
- [Mock Backend (`db.json`)](#mock-backend-dbjson)
- [Tailwind CSS Configuration](#tailwind-css-configuration)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **View Recipes:** Browse a gallery of recipes with titles, descriptions, and images.
- **Add New Recipes:** Submit new recipes including title, ingredients, instructions, and an image.
- **Edit/Delete Recipes:** Update or remove recipes directly from the UI.
- **Favorites:** Mark and filter favorite recipes.
- **Responsive Design:** With Tailwind CSS for a seamless experience across devices.
- **Mock Backend:** Utilizes json-server for data management.

---

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Angular CLI](https://angular.io/cli) (v19 for best experience)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zura014/sweeft-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd sweeft-project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

### Start Both Frontend and Backend Servers

1. Use the `start` script to run both the Angular frontend and mock backend simultaneously:
   ```bash
   npm run start
   ```

- Frontend: Accessible at [http://localhost:4200](http://localhost:4200)
- Mock Backend: Available at [http://localhost:10000/recipes](http://localhost:10000/recipes)

### Individual Servers (Optional)

To run the frontend only:

```bash
npm run frontend
```

To run the mock backend only:

```bash
npm run backend
```

---

## Folder Structure

```
src/
├── app/
│   ├── features/
│   │   ├── home/                      # Landing page
│   │   ├── not-found/                 # Error 404 page
│   │   ├── recipes/
│   │   │   ├── components/
│   │   │   │   ├── list/               # Recipe list component
│   │   │   │   ├── detail/             # Detailed view of a recipe
│   │   │   │   ├── submission/         # New recipe form
│   │   │   │   ├── card/               # Recipe card for list view
│   │   │   │   ├── form/               # Form for recipe modification
│   │   │   ├── services/
│   │   │   │   ├── recipe.service.ts   # Service for recipe operations
│   │   │   ├── interfaces/             # Interfaces for type safety
│   │   │   ├── resolvers/              # Resolve data for components
│   │   │   ├── types/                  # Custom types for clarity
├── shared/                             # Shared components and utilities
│   ├── components/
│   │   ├── header/                     # App header
│   │   ├── loading/                    # Loading indicator
│   ├── interceptors/
│   │   ├── http-error.interceptor.ts   # HTTP error handling
├── app-routing.module.ts               # Routing configuration
├── app.module.ts                       # Main Angular module
├── app.component.ts                    # Root component
├── environments/                       # Environment configurations
└── public/
    ├── icons/                          # SVG icons for the UI
    ├── images/                         # Placeholder and static images
```

---

## Mock Backend (`db.json`)

Using json-server to mimic a backend, here's a sample `db.json`:

```json
{
  "recipes": [
    {
      "id": "1",
      "title": "Spaghetti Carbonara",
      "description": "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
      "ingredients": ["Spaghetti", "Eggs", "Parmesan Cheese", "Pancetta", "Black Pepper"],
      "instructions": "Cook spaghetti. In a bowl, mix eggs and cheese. Cook pancetta. Combine everything and season with pepper.",
      "imageUrl": "https://example.com/images/spaghetti-carbonara.jpg",
      "isFavorite": true
    }
  ]
}
```

Start the backend:

```bash
npm run backend
```

---

## Tailwind CSS Configuration

Custom breakpoints for responsive design:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "576px",
      md: "768px",
      lg: "1080px",
      xl: "1280px",
      xxl: "1440px",
    },
    extend: {
      fontFamily: {
        primaryFont: ["Inter", "sans-serif"],
      },
      colors: {
        borderC: "#c3c6d4",
      },
    },
  },
  plugins: [],
};
```

---

## Scripts

| Script     | Description                                              |
| ---------- | -------------------------------------------------------- |
| `start`    | Starts both frontend and backend servers simultaneously. |
| `frontend` | Runs the Angular development server only.                |
| `backend`  | Initiates the mock backend server.                       |
| `build`    | Builds the Angular app for production.                   |
| `watch`    | Watches for changes and rebuilds the app.                |

---

## Deployment

The application is deployed and accessible at:

- Frontend: https://sweeft-project-alpha.vercel.app/ (Vercel)
- Backend: Hosted on Render

Note: Due to using Render's free tier hosting, the backend server may take a few minutes to wake up if it has been inactive. This will cause a slight delay in data loading on your first visit.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).
