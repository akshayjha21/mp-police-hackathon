# Mp-Police-Hackathon

IPDR Communication Analysis and Mapping Tool
A smart tool to extract and identify B-party (recipient) public IPs and mobile numbers from IPDR logs, enabling accurate mapping of A-party to B-party interactions for law enforcement investigations.

📖 Table of Contents
About

Features

Technologies

Getting Started

Usage

Folder Structure

Team

License

🎯 About
This project addresses the critical need for a streamlined, intelligent system to analyze large volumes of Internet Protocol Detail Records (IPDR). By leveraging machine learning and data visualization, our tool efficiently parses raw IPDR logs to identify and map communication patterns between A-party (initiator) and B-party (recipient) users. This is a powerful resource for law enforcement, telecom security teams, and investigators, providing clear, actionable insights into digital communication networks and suspicious activities.

✨ Features
Advanced Log Parsing Engine: Efficiently processes large and complex IPDR files in various formats (CSV, TXT, JSON, etc.) from different telecom operators.

Accurate A-Party to B-Party Mapping: Precisely extracts and maps initiator (A-party) and recipient (B-party) public IPs and mobile numbers.

Intelligent Data Filtering: Automatically filters out irrelevant records, focusing on key communication sessions for a more targeted investigation.

Interactive Communication Graphs: Visualizes network connections and call relationships using interactive charts powered by Recharts.

Suspicious Activity Detection: Employs a Random Forest machine learning model to automatically flag unusual communication behaviors (e.g., frequent late-night calls, short-duration calls).

Comprehensive Search and Query System: Allows users to search for specific numbers, IP addresses, date ranges, and communication types with ease.

User-Friendly Dashboard: A clean and intuitive React-based interface for visualizing extracted data, communication relationships, and potential red flags.

Integrated Mapping: Uses a Map API to provide geographical context to IP addresses, aiding in location-based analysis.

Secure Authentication: Built with Clerk for robust and secure user authentication and access control.

💻 Technologies
Frontend: React.js

Backend: Node.js (or Python/Flask based on your choice)

Database: MongoDB

Authentication: Clerk

Charts: Recharts

Machine Learning: Scikit-learn (or similar library) for the Random Forest model

Mapping: [Name of your Map API, e.g., Google Maps API, Mapbox]

🚀 Getting Started
Prerequisites
Node.js (version 14 or higher)

MongoDB

Git

Installation
Clone the repository:

Bash

git clone https://github.com/yourusername/IPDR-communication-tool.git
cd IPDR-communication-tool
Install backend dependencies:

Bash

cd server
npm install
Install frontend dependencies:

Bash

cd ../client
npm install
Configuration
Create a .env file in the server directory and add the following environment variables:

MONGODB_URI=<your_mongodb_connection_string>
CLERK_SECRET_KEY=<your_clerk_secret_key>
MAP_API_KEY=<your_map_api_key>
Running the Application
Start the backend server:

Bash

cd server
npm start
Start the frontend development server:

Bash

cd ../client
npm start
The application will be accessible at http://localhost:3000.

🛠️ Usage
Login: Access the dashboard using secure authentication powered by Clerk.

Upload Logs: Navigate to the upload section to submit IPDR log files (CSV, TXT, JSON).

Analyze Data: The system will automatically parse the logs, extract relevant data, and identify communication patterns.

View Dashboard: Explore the dashboard to see an overview of the data, including:

Extracted A-party and B-party numbers/IPs.

Interactive network graphs of communication.

A list of flagged suspicious activities.

Geographic mapping of IP addresses.

Query and Filter: Use the search bar and filters to narrow down your investigation by specific numbers, IPs, or date ranges.

📁 Folder Structure
IPDR-communication-tool/
├── client/                     # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable UI components (e.g., tables, charts)
│   │   ├── pages/              # Main application pages (e.g., Dashboard, Upload, Login)
│   │   ├── services/           # API communication layer
│   │   ├── context/            # Global state management
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
│
├── server/                     # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/        # Handle API requests and logic
│   │   ├── models/             # Mongoose schemas for MongoDB
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # Business logic, ML models, log parsing
│   │   │   ├── logParser.js
│   │   │   └── mlModel.js
│   │   ├── config/             # Environment variables and other configurations
│   │   └── app.js              # Main server file
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
🤝 Team

