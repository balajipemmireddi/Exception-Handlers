Project: Hotel Booking Application (RBAC Edition)
Team: 4 members (2 Frontend, 2 Backend)
Stack: React, JavaScript, Tailwind CSS, React Router
Goal: Implement a responsive frontend UI for hotel booking with Role-Based Access Control (RBAC) and distinct dashboards, utilizing mock data until backend integration.

PHASE 1: Project Setup and API Service Initialization
Goal: Initialize the React project and create the centralized `apiService.js` with mock data and `USE_MOCKS` toggle.
Tasks:
  - Create a new React project using Vite or Create React App.
  - Set up Tailwind CSS for styling.
  - Create `src/services/apiService.js`.
  - Implement `const USE_MOCKS = true;` toggle.
  - Populate `MOCK_DATA` in `apiService.js` exactly as provided in context-rbac.md for `hotels`, `bookings`, `allBookings`, `revenue`, `analytics`, and `authResponse`.
Validation Command: `npm run dev` and verify the app loads without errors. Check `apiService.js` for the `USE_MOCKS` toggle and mock data.
Exit Criteria: The React app runs successfully, and `apiService.js` contains the correct mock data and toggle.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 2: Authentication Service and State Management
Goal: Implement authentication logic using the mock API and manage user state, including role-based access.
Tasks:
  - Create functions in `apiService.js` for `login` and `register` that return mock `authResponse`.
  - Implement a React Context or Redux store for authentication state (user details, token, role).
  - Implement the JWT decode and store pattern as defined in context-rbac.md, storing the highest role.
  - Create helper functions/hooks for role-gating (e.g., `isUser`, `isAdmin`, `isSuperAdmin`).
Validation Command: Manually trigger the mock login function (e.g., by modifying `apiService.js` to return a specific role) and check `localStorage` and the global state for correct `token`, `userId`, `name`, and `role`.
Exit Criteria: Mock login successfully updates the global state and `localStorage` with token, userId, name, and the highest role.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 3: Routing and Layout Setup with RBAC
Goal: Set up React Router and create the main application layout, implementing role-based route protection.
Tasks:
  - Install `react-router-dom`.
  - Create a main `Layout` component with a navigation bar that dynamically shows/hides links based on user role.
  - Define routes for Home, Login, Register, Hotel List, Hotel Detail, User Dashboard, Admin Dashboard, and Super Admin Dashboard.
  - Implement protected routes using the role-gating helper functions/hooks.
Validation Command: Navigate to `/login`, `/register`, `/`, and attempt to access `/admin/bookings` and `/superadmin/analytics` (should redirect if not logged in or wrong role).
Exit Criteria: Routes render the correct placeholder components, and protected routes redirect to login or show an access denied message if the user lacks the required role.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 4: Authentication UI (Login & Register)
Goal: Build the Login and Registration forms and integrate with the authentication service.
Tasks:
  - Create `Login.jsx` component with email and password fields.
  - Create `Register.jsx` component with name, email, and password fields.
  - Connect forms to the `apiService.js` auth functions.
  - Handle and display mock error responses (e.g., invalid credentials, email already exists).
Validation Command: Submit the login form with mock credentials (e.g., `authResponse` with `role: "USER"`).
Exit Criteria: Successful submission redirects to the home page, and the navigation bar updates to show user status and appropriate links.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 5: Hotel Listing UI (Home Page)
Goal: Display a list of hotels using the mock data from `apiService.js`.
Tasks:
  - Create `HotelList.jsx` component.
  - Fetch hotel data using `apiService.js` (which returns `MOCK_DATA.hotels`).
  - Create a `HotelCard.jsx` component to display individual hotel summaries (name, location, image, star rating, starting price).
Validation Command: View the home page in the browser.
Exit Criteria: The home page displays a list of hotel cards populated with the mock data.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 6: Hotel Search Functionality
Goal: Implement a search bar to filter hotels by location, check-in, and check-out dates.
Tasks:
  - Add a search bar to the home page with input fields for location, check-in date, and check-out date.
  - Implement a mock search function in `apiService.js` that filters `MOCK_DATA.hotels` based on location and date availability.
  - Update `HotelList.jsx` to display search results.
Validation Command: Enter "Mumbai" in the location search bar and submit. Then try with dates.
Exit Criteria: The hotel list updates to show only hotels matching the mock search criteria.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 7: Hotel Detail UI
Goal: Display detailed information for a selected hotel, including available rooms, using mock data.
Tasks:
  - Create `HotelDetail.jsx` component.
  - Fetch specific hotel data using `apiService.js` based on the URL parameter (ID).
  - Display hotel description, larger image, and a list of rooms.
  - Create a `RoomCard.jsx` component to display room details (type, price, capacity, availability).
Validation Command: Click on a hotel card from the home page.
Exit Criteria: The application navigates to `/hotels/:id` and displays the correct hotel details and rooms from the mock data.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 8: Booking UI (Create Booking) & User Dashboard
Goal: Implement the UI for users to book a room and view/cancel their own bookings.
Tasks:
  - Add a "Book Now" button to available `RoomCard`s in the `HotelDetail` view.
  - Create a booking modal or dedicated page (`BookingForm.jsx`).
  - Implement mock booking and cancellation functions in `apiService.js` that simulate responses from `MOCK_DATA.bookings`.
  - Create `UserDashboard.jsx` (protected for USER role) to display `MOCK_DATA.bookings`.
  - Add a "Cancel" button to bookings in the `UserDashboard`.
Validation Command: Log in as a USER. Create a mock booking. Navigate to the User Dashboard and verify the booking appears. Click "Cancel" on a booking.
Exit Criteria: Booking creation shows success, and the User Dashboard correctly displays and allows cancellation of mock bookings.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 9: Admin Dashboard (Manage Bookings)
Goal: Create an Admin dashboard to view, edit, and delete all system-wide bookings using mock data.
Tasks:
  - Create `AdminDashboard.jsx` component (protected for ADMIN role).
  - Fetch all bookings using `apiService.js` (which returns `MOCK_DATA.allBookings`).
  - Display bookings in a table with user details, hotel, room, dates, status, and total amount.
  - Implement mock edit and delete functions in `apiService.js` for admin bookings.
  - Add UI elements for editing and deleting bookings.
Validation Command: Log in as an ADMIN. Navigate to `/admin/bookings`. Verify all mock bookings are displayed. Attempt to edit and delete a mock booking.
Exit Criteria: The Admin Dashboard displays all mock bookings, and edit/delete operations are simulated correctly in the UI.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 10: Super Admin Dashboard (Analytics & Revenue)
Goal: Create a Super Admin dashboard to display system analytics and revenue data using mock data.
Tasks:
  - Create `SuperAdminDashboard.jsx` component (protected for SUPER_ADMIN role).
  - Fetch revenue data using `apiService.js` (returns `MOCK_DATA.revenue`).
  - Fetch analytics data using `apiService.js` (returns `MOCK_DATA.analytics`).
  - Display these metrics in a clear, readable format.
Validation Command: Log in as a SUPER_ADMIN. Navigate to `/superadmin/analytics`. Verify revenue and analytics data are displayed.
Exit Criteria: The Super Admin Dashboard correctly displays mock revenue and analytics data.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 11: Global Error Handling and UI Polish
Goal: Implement consistent error display and refine the overall user interface for all roles.
Tasks:
  - Implement a global toast notification system for success/error messages.
  - Ensure all API calls (mock) handle errors gracefully and display the standardized error format.
  - Polish CSS styling, ensure responsiveness across devices and for different role dashboards.
Validation Command: Trigger a mock error (e.g., invalid login, or a simulated API error) and verify the toast notification appears with the correct message.
Exit Criteria: A styled error message appears, matching the standardized error format, and the UI is generally polished.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

PHASE 12: Backend Integration Preparation
Goal: Prepare the frontend to switch from mock data to the real backend API.
Tasks:
  - Review `apiService.js` and ensure all functions are ready to make real `fetch` or `axios` calls when `USE_MOCKS = false`.
  - Ensure the `Authorization` header is correctly appended to protected requests using the token from `localStorage`.
  - Document the environment variables needed for the real API URL.
Validation Command: Set `USE_MOCKS = false` in `apiService.js` and verify that the app attempts to make real network requests (they will fail if the backend isn\'t running, but the attempt should be visible in the network tab).
Exit Criteria: Network requests are fired to the correct endpoints with appropriate headers when mocks are disabled.
Failure Protocol: If validation fails, DO NOT rewrite previous phases or core architecture. Confine fixes strictly to the current phase\'s files. If unable to fix quickly, STOP and ask the human Lead for intervention.

## AGENTS.md Block

## Context
This project is the frontend for a Hotel Booking Application with RBAC. It uses React and Tailwind CSS. Development relies on a centralized `apiService.js` with a `USE_MOCKS` toggle to allow parallel development with the backend team. It includes distinct dashboards for USER, ADMIN, and SUPER_ADMIN roles.

## Current Phase
PHASE 12 — Backend Integration Preparation

## Stack
React, JavaScript (.js/.jsx), Tailwind CSS, React Router

## Rules
- Don\'t touch files outside the scope of this phase.
- Prefix commits with PHASE-N:
- YOU MUST RUN THE VALIDATION COMMAND before proceeding.
- Strictly enforce plain JavaScript (.js and .jsx files). Do NOT use TypeScript (.ts/.tsx).
- Strictly forbid hardcoding mock data directly inside React UI components. All UI components must fetch data from `apiService.js`.

## File Structure Snapshot
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   ├── hotel/
│   │   │   ├── HotelCard.jsx
│   │   │   └── RoomCard.jsx
│   │   ├── booking/
│   │   │   └── BookingForm.jsx
│   │   └── admin/
│   │       ├── AdminBookingTable.jsx
│   │       └── SuperAdminAnalytics.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── HotelDetail.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── SuperAdminDashboard.jsx
│   ├── services/
│   │   └── apiService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Deployment Checklist
- Environment variables: `VITE_API_BASE_URL`
- CI/CD pipeline steps:
  1. Install dependencies (`npm install`).
  2. Run linter and tests.
  3. Build project (`npm run build`).
  4. Deploy `dist` folder to Vercel/Netlify/S3.
- Nginx configuration (if self-hosting):
  - Serve static files from the build directory.
  - Fallback routing to `index.html` for React Router.
