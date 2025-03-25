# Andikar Admin Dashboard

Admin dashboard for managing Andikar Backend API services. This dashboard provides a complete interface for administrators to manage users, API keys, view logs, track transactions, and configure system settings.

## Features

- **Complete Authentication System** - Secure login and session management
- **User Management** - Create, update, and manage user accounts
- **API Keys Administration** - Generate and control API access keys
- **Transaction History** - Track and analyze payment transactions
- **System Logs** - Monitor API and system logs with filtering capabilities
- **Settings Configuration** - Manage system-wide settings
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between dark and light themes

## Tech Stack

- **React** - Frontend library
- **Material UI** - Component library
- **Nivo** - Data visualization
- **React Router** - Navigation
- **Formik & Yup** - Form handling and validation
- **Axios** - API requests
- **JWT** - Authentication

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/granitevolition/andikar-admin-dashboard.git
   cd andikar-admin-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=https://web-production-a617.up.railway.app
   ```

4. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

### Deploy to Railway

1. Create a new Railway project

2. Connect your GitHub repository to Railway

3. Configure environment variables:
   - `REACT_APP_API_URL`: URL of your backend API

4. Railway will automatically deploy your application

5. Optional: Configure a custom domain in Railway settings

### Build for Production

To build the app for production, run:

```
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder, ready to be deployed to any static hosting service.

## API Integration

The dashboard is designed to work with the Andikar Backend API. It connects to the following endpoints:

- `/token` - Authentication
- `/users` - User management
- `/api-keys` - API key management
- `/logs` - System logs
- `/transactions` - Payment transactions
- `/settings` - System settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material UI](https://mui.com/)
- [Nivo Charts](https://nivo.rocks/)
- [React Pro Sidebar](https://github.com/azouaoui-med/react-pro-sidebar)
- [Formik](https://formik.org/)
