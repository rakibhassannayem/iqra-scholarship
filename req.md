Iqra Scholarship
Project Overview and Requirements

1. Project Overview
   The Scholarship Management System is a web-based platform designed to manage student registration, scholarship results, scholarship grants, payments, prize distribution, and related administrative activities through a centralized system.

The system will consist of two main parts:

1. Public Website: Accessible to students and general visitors for registration, result checking, and viewing public information.
2. Admin Panel: Used by authorized administrators and staff to manage schools, students, scholarships, payments, ceremonies, website content, and other system operations.
   The application will be developed using Next.js, with a self-hosted PostgreSQL database and a modular architecture suitable for future expansion and VPS deployment.
3. Public Website
   The public website will provide the essential features required by students and general visitors.
   2.1 Student Registration
   Students will be able to register for the scholarship through an online registration form.
   Registration Information

- School Name (selected from available registered schools)
- Student Name
- Class (Class 1 to Class 10)
- Roll Number
  After successful registration, the system will automatically generate a unique Student ID.
  Student ID Format
  The Student ID will follow this format: YY_EIIN_ClassID_Roll

Example: 26_123456_05_12

Where:

- YY: The last two digits of the registration year.
- EIIN: The EIIN number of the student's school.
- ClassID: The identifier representing the student's class.
- Roll: The student's roll number.
  The generated Student ID will be provided to the student and used to check the scholarship result later. The Student ID generation process will include appropriate validation to prevent duplicate IDs and invalid registration data.
  2.2 See Result
  Students will be able to check their scholarship results using their generated Student ID. The result page will display the student's scholarship status.
- If the Student Receives a Scholarship:
  - Displays scholarship result/status.
  - Displays relevant scholarship information.
  - Displays scholarship category, where applicable.
  - Displays scholarship certificate (if available), which the student will be able to download.
- If the Student Does Not Receive a Scholarship:
  - Displays an appropriate message informing the student that they were not selected for the scholarship (e.g., "Unfortunately, you did not receive the scholarship this time.").
    Result Publication
    Scholarship results will be managed through the Admin Panel. Students will be able to view the result according to the published result status.
    2.3 Other Public Pages
    The website will include basic informational pages such as:
- Home
- About Us
- Contact
- Blog
- Other necessary informational pages, if required.
  The homepage may display important announcements and prize-giving ceremony notices. The public website will remain focused on scholarship-related services and essential information.

3. Admin Panel
   The Admin Panel will be used to manage the complete scholarship management process.
   3.1 School Management
   Administrators will be able to manage participating schools.

- Features:
  - Add School
  - Edit School
  - Delete School
  - View School List
  - View School Details
    School information will include necessary details, such as school name and EIIN. The system will validate school information and prevent duplicate EIIN entries.
    3.2 Scholarship Category Management
    Administrators will be able to manage different scholarship categories.
- Features:
  - Add Scholarship Category
  - Edit Scholarship Category
  - Delete Scholarship Category
  - View Scholarship Categories
  - View Category Details
    Scholarship categories will be used when assigning scholarships to eligible students.
    3.3 Student Registration Management
    Administrators will be able to view and manage student registration records.
- Student Information:
  - School Name
  - Student Name
  - Class
  - Roll Number
  - Generated Student ID
  - Registration Date
  - Registration Status (where applicable)
- Features:
  - View registered students.
  - Search and filter student records.
  - View individual student details.
  - Add student records manually, if required.
  - Edit student information.
  - Delete student records, subject to appropriate permissions.
    The system will maintain the relationship between students and their registered schools.
    3.4 Scholarship Grant Management
    This section will be used to grant scholarships to eligible students.
- Features:
  - Select registered students.
  - Assign a scholarship category.
  - Grant a scholarship to a student.
  - Update scholarship status.
  - View and manage scholarship grant information.
    The system will maintain scholarship grant records and associate each grant with the relevant student and scholarship category.
    3.5 Granted Student List
    A dedicated section will display students who have been granted scholarships.
- Features:
  - View granted students.
  - Add a granted student, where permitted.
  - Edit scholarship grant information.
  - Delete or revoke a grant, subject to permissions.
  - View student and scholarship details.
  - Search and filter granted student records.
    This section will provide a centralized view of all scholarship recipients.
    3.6 Payment Management
    The system will provide payment management for students who receive scholarships or prizes.
- Features:
  - Manage online payment records.
  - Manage offline payment records.
  - Record payment amounts and dates.
  - Update payment status.
  - View payment information and history.
  - Track pending and completed payments.
  - Associate payments with the relevant student and scholarship grant.
    Actual online payment processing through a payment gateway will be implemented if required and approved. The specific gateway and integration method will be determined before implementation. Offline payments will be recorded and managed by authorized administrators or staff.
    3.7 Prize-Giving Ceremony Management
    Administrators will be able to manage information related to prize-giving ceremonies.
- Features:
  - Add ceremony notices.
  - Edit ceremony notices.
  - Delete ceremony notices.
  - Manage ceremony title, date, time, location, and description.
  - Publish or unpublish ceremony notices, where applicable.
    Important ceremony notices may be displayed on the public homepage through notice cards, a marquee or scrolling notice section, or other appropriate announcement sections. Only published notices will be displayed publicly.
    3.8 Prize Receive Confirmation
    This section will be used to confirm whether a scholarship or prize recipient has actually received their prize.
- Features:
  - View granted students.
  - View relevant scholarship and prize information.
  - Confirm that a prize has been received.
  - Update receiving status.
  - Record the confirmation date and the responsible staff member.
  - View confirmation information and history.
    This section will help maintain an accurate record of prize distribution.
    3.9 Website Settings and Content Management
    The Settings section will allow authorized administrators to manage editable content on the public website without modifying the application source code.
- Configurable Information May Include:
  - Website title.
  - Homepage content and information.
  - Contact address, location, and details.
  - About Us content.
  - Blog content, if included in the management scope.
  - Other configurable website information.
    The exact settings and editable content will be finalized according to the website's requirements.
    3.10 Browsing Log Management
    The system will maintain browsing logs to track relevant user access and navigation within the application.
- Log Information May Include:
  - User or administrator identifier, where available.
  - Accessed page or section.
  - Date and time of access.
  - Relevant session or request information.
  - IP address, where appropriate and permitted.
- Features:
  - Record relevant page access.
  - View browsing logs.
  - Filter logs by user, page, and date.
  - Review access history when necessary.
    Public browsing and authenticated administrative browsing may be tracked differently according to the final logging and privacy requirements.
    3.11 Activity History / Audit Log
    The system will maintain an activity history to record important actions performed by administrators and staff to maintain a clear record of who performed an action, what was done, and when it happened.
- Activity Information:
  - User who performed the action.
  - Action performed.
  - Relevant module or record.
  - Date and time.
  - Previous and updated values, where appropriate.
- Examples of Logged Activities:
  - Adding, editing, or deleting a school.
  - Registering or updating a student.
  - Creating or modifying a scholarship category.
  - Granting or revoking a scholarship.
  - Updating payment information or status.
  - Creating or updating a ceremony notice.
  - Confirming prize receipt.
  - Updating website settings.
  - Creating, updating, or deactivating an administrator or staff account.
- Features:
  - View activity history.
  - Filter records by user, action, module, and date.
  - Review changes to important records.
  - Restrict log access to authorized roles.
    The activity history will be maintained separately from ordinary browsing logs. Important audit records should be protected against unauthorized modification or deletion.

4. Authentication and Role-Based Access Control (RBAC)
   The system will support multiple administrator and staff accounts through a secure authentication and authorization mechanism.
   4.1 Authentication Features

- Secure login and logout.
- Email and password-based authentication.
- Secure password storage.
- Session management.
- Protection for authenticated Admin Panel routes.
- Admin and staff account management.
- Account activation and deactivation.
- Role-based access control.
  4.2 User Roles and Permissions
  The following roles are proposed for the initial system:

1. Super Admin
   - Full access to all system features.
   - Create, manage, and deactivate administrator and staff accounts.
   - Assign roles and permissions.
   - Manage system-wide settings.
   - Access relevant browsing logs and activity history.
2. Admin
   - Manage schools, students, scholarship categories, scholarship grants, and granted student records.
   - Manage payments and prize-giving ceremonies.
   - Manage website content and settings according to assigned permissions.
   - View relevant system records and activity history.
3. Staff
   - Access only the modules and actions permitted by their assigned role.
   - Perform assigned administrative tasks.
   - Access relevant records required for their responsibilities.
     The final permissions for each role will be confirmed before implementation. Authorization will be enforced on the server side, not only by hiding navigation links or buttons in the user interface.
4. Basic System Workflow
   The overall scholarship workflow will be:
5. School Registration and Management
6. Student Registration
7. Automatic Student ID Generation
8. Scholarship Eligibility Review and Grant
9. Result Publication
10. Student Result Checking
11. Certificate Generation and Download, or Result Message Display
12. Payment Management
13. Prize-Giving Ceremony Announcement
14. Prize Distribution
15. Prize Receive Confirmation
16. Activity and Audit History Recording
    The browsing log and activity history will operate alongside the relevant system processes.
17. Technology Stack
    6.1 Application Framework

- Full-stack Framework: Next.js
- Next.js will be used to develop the public website, Admin Panel, and server-side application functionality.
  6.2 Database and ORM
- Database: PostgreSQL (Self-hosted)
- ORM: Drizzle ORM
- Migration Tool: Drizzle Kit
- PostgreSQL will be used as the primary relational database. Development will initially take place using a local PostgreSQL database and later configured on the VPS for production deployment.
- Drizzle ORM will be used to define database schemas and perform database operations. Drizzle Kit will be used to manage schema migrations.
  6.3 Authentication and Authorization
- Authentication: Auth.js
- Authorization: Role-Based Access Control (RBAC)
- Authentication and session management will support secure access to the Admin Panel. Role-based authorization will determine which operations each user can perform.
  6.4 File Storage
- Initial Approach: Local filesystem storage.
- Deployment Requirement: VPS-compatible persistent file storage.
- Generated certificates and other necessary files will be stored using an appropriate storage strategy. The storage configuration will ensure that required files remain available after application restarts and deployments.
  6.5 Deployment and Hosting
- Hosting: Linux VPS
- Web Server / Reverse Proxy: Nginx
- Database: PostgreSQL hosted on the VPS.
- Production deployment will be configured so that the application and database can operate securely on the VPS. Environment variables will be used to manage sensitive values.
  6.6 Application Type
- Web-based application (Public Website & Admin Panel).
- Built on a modular architecture to support future expansion and additional features.

7. Project Scope
   The initial version of the system will focus on the following features:
   Public Website

- Student registration.
- Automatic Student ID generation.
- Student result checking.
- Scholarship status display.
- Certificate generation and download.
- Result message for students who are not selected.
- Home, About Us, Contact, and Blog pages.
- Public announcement and ceremony notices.
  Admin Panel
- School management.
- Scholarship category management.
- Student registration management.
- Scholarship grant management.
- Granted student management.
- Online and offline payment record management.
- Prize-giving ceremony management.
- Prize receive confirmation.
- Website settings and content management.
- Multiple administrator and staff accounts.
- Role-based access control.
- Browsing log management.
- Activity history and audit log management.
  Infrastructure and Security
- Local PostgreSQL development environment.
- Drizzle ORM and database migrations.
- Secure authentication and authorization.
- VPS-compatible file storage.
- Linux VPS deployment.
- Nginx configuration.
- Environment-based configuration management.

8. Items to Finalize Before Implementation
   The following details will be confirmed before development begins:
1. Student ID Rules: Confirm the EIIN and class identifier format, roll number validation, and duplicate registration rules.
1. Scholarship Result Workflow: Confirm how results will be published and whether unpublished results remain inaccessible to students.
1. Certificate Design: Finalize certificate layout, required information, and generation format.
1. Payment Processing: Confirm whether online payment gateway integration is required or whether recording online/offline payments is sufficient for the initial version.
1. Role Permissions: Finalize which modules and actions Super Admin, Admin, and Staff can access.
1. Logging Policy: Confirm which browsing events will be recorded, how long logs will be retained, and which roles can view them.
1. File Storage and Backup: Finalize storage, backup, and recovery requirements for certificates and other files.
1. Website Content: Confirm which public pages and content can be edited from the Admin Panel.
1. Deployment Requirements: Finalize VPS specifications, domain configuration, SSL, database backup, and production deployment settings.
   These details will be finalized with the project supervisor before implementation.
1. Expected Outcome
   The expected outcome is a centralized scholarship management platform that simplifies student registration, result publication, scholarship administration, payment tracking, prize distribution, and website content management.

The system will provide students with a simple way to register and check results while giving authorized administrators and staff the tools needed to manage scholarship operations securely and efficiently.

The application will be designed for local development and subsequent deployment to a Linux VPS, with a modular structure that supports future expansion.
