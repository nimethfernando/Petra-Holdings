# Petra-Constructions

A modern, responsive web application for **Petra-Holdings**, a premier construction company. This platform showcases the company's engineering expertise, ongoing and completed projects, service offerings, and provides a seamless way for clients to get in touch.

---

## 🚀 Features

- **Project Showcase:** High-quality galleries displaying completed and ongoing construction projects.
- **Service Overview:** Detailed breakdown of construction, architectural, and project management services.
- **Fully Responsive:** Optimized for a seamless experience across mobile, tablet, and desktop devices.
- **Contact & Inquiries:** Integrated communication form (powered by EmailJS) for client consultations and quotes.
- **Modern Tech Stack:** Built using React and Vite for blazing-fast performance.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Library | React |
| Build Tool | Vite |
| Styling | Custom CSS / Tailwind CSS |
| Form Handling | EmailJS |
| Linting | ESLint |

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have **Node.js** (v16.x or higher recommended) and **npm** installed on your system. You can check your versions by running:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nimethfernando/Petra-Holdings.git
```

2. Navigate into the project directory:

```bash
cd Petra-Holdings
```

3. Install the dependencies:

```bash
npm install
```

---

## 💻 Development

To start the local development server with hot-reloading, run:

```bash
npm run dev
```

Once the server starts, open your browser and navigate to the local URL provided in your terminal (usually `http://localhost:5173`).

---

## 📦 Building for Production

To build the application for production deployment, run:

```bash
npm run build
```

This will compile and optimize the project, generating a production-ready `dist` folder that can be hosted on platforms like **Vercel**, **Netlify**, or **AWS**.

---

## 📁 Project Structure

```
Petra-Holdings/
├── public/              # Static assets (Logos, Icons, Images)
├── src/                 # Application source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page views (Home, About, Projects, Contact)
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .gitignore           # Files and folders to ignore in Git
├── eslint.config.js     # Linter configuration
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration file
```
