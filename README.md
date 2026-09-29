# Leave Management System

A custom Leave Management System built to provide a modern, user-friendly interface for employees to apply for leave, track leave requests, view leave summaries, and manage leave-related activities.

The project is being developed as a customized alternative to the standard leave management experience, with a focus on a clean UI, reusable components, API-based data handling, and future integration with Zoho People.

---

## 📌 Project Overview

The Leave Management System is designed to manage the complete employee leave lifecycle.

The system allows employees to:

- View their leave summary
- Check available leave balances
- Apply for leave
- View submitted leave requests
- Track leave request status
- View upcoming leaves and holidays
- Manage compensatory leave requests
- View team-related leave information
- Track absent days
- Interact with a modern custom dashboard

The application is currently being developed with a custom frontend and backend architecture.

The initial development uses mock/local data for UI development and testing. The application will later be connected with Zoho People APIs to retrieve and manage real employee and leave data.

---

# 🎯 Project Objectives

The main objectives of this project are:

1. Build a modern and responsive Leave Management interface.
2. Replace the standard leave UI with a customized user experience.
3. Create reusable frontend pages and components.
4. Separate frontend and backend responsibilities.
5. Prepare the application for Zoho People API integration.
6. Implement employee leave application functionality.
7. Implement leave request tracking.
8. Implement leave approval workflow.
9. Display real-time leave information.
10. Provide a scalable structure for future HRMS features.

---

# 🏗️ Application Architecture

The project follows a frontend + backend architecture.

```text
                    Leave Management System
                              |
               +--------------+--------------+
               |                             |
           Frontend                       Backend
               |                             |
        HTML / CSS / JS              Node.js / Server
               |                             |
               +--------------+--------------+
                              |
                        API Integration
                              |
                        Zoho People
                              |
                    Employee Leave Data