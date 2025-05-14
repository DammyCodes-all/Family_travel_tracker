# Travel Tracker

A web application that allows users to track countries they've visited around the world with a visual map display.

![Travel Tracker Screenshot](public/screenshot.png)

## Features

- **User Management**: Create and select different users with custom colors
- **Country Tracking**: Add visited countries to your personal travel map
- **Visual Map**: See your visited countries highlighted on a world map
- **Data Persistence**: All data is stored in a PostgreSQL database

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - PostgreSQL (pg module)
  - EJS templating

- **Frontend**:
  - HTML/CSS
  - JavaScript
  - SVG world map

## Prerequisites

Before running this application, you need to have:

- Node.js installed (v14.0.0 or higher)
- PostgreSQL server running
- Basic knowledge of SQL for database setup

## Database Setup

1. Create a new PostgreSQL database called `travel`

2. Create the required tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  color VARCHAR(50) DEFAULT 'teal'
);

CREATE TABLE countrydata (
  country_code CHAR(2) PRIMARY KEY,
  country_name VARCHAR(100) NOT NULL
);

CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  country_code CHAR(2) NOT NULL,
  CONSTRAINT unique_visit UNIQUE(user_id, country_code)
);
```

3. Import country data from the provided CSV file:

```sql
COPY countrydata(country_code, country_name)
FROM '/path/to/countries.csv' 
DELIMITER ',' 
CSV HEADER;
```

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/travel-tracker.git
cd travel-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Configure the database connection in `app.js`:
```javascript
const db = new pg.Client({
    user : 'postgres',
    host : 'localhost',
    database : 'travel',
    password : 'YourPassword',
    port : 5432
})
```

4. Start the application:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Select or Create a User**:
   - Choose an existing user from the dropdown menu
   - Or click "Add User" to create a new user with a custom color

2. **Track Countries**:
   - Type the name of a country you've visited
   - Click "Add" to add it to your visited countries list

3. **View Your Map**:
   - The world map will highlight all countries you've visited
   - The total count of visited countries appears at the top

## Error Handling

The application handles several types of errors:
- Country not found in database
- User not selected
- Country already visited
- Database connection errors

## Project Structure

```
travelTracker/
├── app.js                 # Main application file
├── package.json           # Project dependencies
├── countries.csv          # CSV file with country codes and names
├── public/                # Static files
│   └── styles/            # CSS stylesheets
│       ├── main.css       # Main stylesheet
│       └── new.css        # Stylesheet for new user page
└── views/                 # EJS templates
    ├── index.ejs          # Main page with map
    └── new.ejs            # New user form
```

## Dependencies

- express: Web framework for Node.js
- pg: PostgreSQL client for Node.js
- ejs: Embedded JavaScript templates
- body-parser: Parse incoming request bodies

## Troubleshooting

- **Database Connection Issues**: Ensure your PostgreSQL server is running and credentials are correct
- **Country Not Found**: Make sure the country name matches exactly with the database entries
- **Duplicate Countries**: Each country can only be added once per user

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Country data provided by [countries.csv](009%20countries.csv)
- Map visualization based on SVG world map
