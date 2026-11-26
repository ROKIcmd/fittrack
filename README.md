

<p align="center">
  <img src="/cf5fe00f-d53a-4767-9f5d-8c6cef6859b9.webp" alt="FitTrack Logo" width="120" />
</p>

<h1 align="center">FITTRACK</h1>

<p align="center">
  <strong>A unified Gym Membership Management App for Admins, Trainers, and Members.</strong>
</p>

<p align="center">
  Bringing together facility operations, coaching workflows, and personal fitness tracking into a single full-stack platform. Below is the architectural breakdown, feature specifications, and data structure required to build and operate the system.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java_21-1E293B?style=for-the-badge&logo=openjdk&logoColor=60A5FA" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-2563EB?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Maven-334155?style=for-the-badge&logo=apachemaven&logoColor=93C5FD" alt="Maven" />
  <img src="https://img.shields.io/badge/React_19-0284C7?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/JavaScript-475569?style=for-the-badge&logo=javascript&logoColor=BFDBFE" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vite-1D4ED8?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-334155?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Git-1E293B?style=for-the-badge&logo=git&logoColor=93C5FD" alt="Git" />
</p>

<p align="center">
  <a href="#application-design">Architecture</a> •
  <a href="#about-the-project">Features</a> •
  <a href="#design-patterns">Design Patterns</a> •
  <a href="#patch-notes">Patch Notes</a>
</p>

## About the Project

The application is a fitness management platform designed to streamline trainer-client interactions, workout programming, and fitness progress tracking. It consists of two primary interfaces:

### Trainer Portal (Coaching & Programming)

Provides trainers with tools to manage assigned clients, create personalized workout programs, and monitor training performance.

-   **Client Management:** View assigned members, membership status, recent activity, and fitness goals.
-   **Workout Program Builder:** Create workout plans from scratch or customize existing templates.
-   **Exercise Configuration:** Organize routines by training days and define exercises, sets, reps, weights, rest intervals, and instructions.
-   **Workout Monitoring:** Review completed workout logs, compare actual performance against prescribed targets, and provide feedback.

### Member App (Onboarding & Workout Execution)

Provides members with a mobile-friendly platform for accessing workout programs, recording training sessions, and tracking fitness progress.

-   **Onboarding & Goal Setting:** Collect personal information, baseline fitness metrics, training experience, injury history, and fitness goals.
-   **Membership & Trainer Information:** View membership details, payment status, renewal dates, and assigned trainer information.
-   **Workout Viewer:** Access assigned routines, exercise instructions, target metrics, and rest timers.
-   **Workout Logging:** Record completed sets, reps, weights, session notes, and Rate of Perceived Exertion (RPE).
-   **Progress Tracking:** Review workout history, training volume, personal records, and workout consistency.

### Project Objective

To provide an integrated platform that simplifies fitness program management, improves trainer-client collaboration, and enables consistent tracking of individual fitness progress.

## Application Design
### System Architecture & Domain Model
> **TBA**
### Design Patterns
#### Creational: Singleton Pattern
-   **Location:**  `backend/src/main/java/com/fittrack/backend/repository/DataStore.java`
- The `DataStore` class implements the thread-safe **Double-Checked Locking (DCL)** variant of the Singleton pattern. Since this application utilizes direct binary file persistence (`.dat` files) rather than a managed database connection pool or Spring-managed beans for repositories, `DataStore` guarantees that only one global instance manages the files across concurrent requests. Having multiple instances of the datastore could lead to race conditions or file-locking conflicts when writing to disk. The singleton lifecycle ensures all consumers (such as `DemoSeeder`, `AuthController`, and `DashboardService`) share the exact same synchronized repository instances and memory locks.
#### Structural: Facade Pattern
-   **Location:**  `backend/src/main/java/com/fittrack/backend/repository/DataStore.java`
- DataStore serves not only as a Singleton but also as a **Facade** over the various underlying persistence subsystems, such as `UserRepository`, `PlanRepository`, and `NotificationRepository`, among others.  The application splits data across multiple domain repositories and raw `FileRepository` instances. Each repository requires distinct file paths (data/memberships.dat, data/metrics.dat, etc.) and identity-resolution lambdas (`Membership::getId`, `BodyMetric::getId`). Without the facade, client layers would have to manage file paths, instantiate low-level file repositories, and resolve dependencies independently. `DataStore` presents a single, uniform interface (`DataStore.getInstance().sessions()`, `DataStore.getInstance().users()`) hiding the instantiation complexity of the persistence subsystem.
#### Structural: Adapter Pattern
-   **Location:**    
    -   Target Interface: `backend/src/main/java/com/fittrack/backend/repository/Repository.java`
    -   Adapter: `backend/src/main/java/com/fittrack/backend/repository/FileRepository.java`
- `FileRepository<T>` acts as an **Adapter** that adapts Java's procedural, low-level stream/serialization APIs (`FileInputStream`, `FileOutputStream`, `ObjectInputStream`, `ObjectOutputStream`, `File`) to conform to the high-level domain Repository<T> interface. Dependent services only interact with the `Repository<T>` contract (`save`, `findById`, `findAll`). They do not need to know that objects are being serialized to disk or that reads and writes require stream wrapping, directory verification (mkdirs), or synchronization locks. By adapting stream operations to a general-purpose repository contract, alternative storage mechanisms (e.g., an in-memory repository or database-driven repository) can be substituted in the future without changing the caller-side logic in the rest of the application.


> **CLASS DIAGRAM TBA**

## Patch Notes
#### V 1.0 [█░░░░░░░░░] 10%
 - Created the github repository and added the members
 - Created the README
 - Created log in page
 - Created sign up page
 - Created class diagram
#### V 1.1 [██░░░░░░░░] 10%
 - Added Patch Notes to the README
 - Removed admin class
 - Added new classes to the class diagram
 - Added Navigable Systems
 - Optimized pop-ups and file writing systems
#### V 1.2  [██░░░░░░░░] 20%
 - Started the frontend using react
 - Started the backend using Springboot
 - 80% progress for the authentication pages
#### V 1.3  [███░░░░░░░] 30%
- Migrated progress to React and Springboot project
- Authentication and Member Dashboards are now up



## Authors
- Knowell M. Lawas --- **Backend and front end utils** --- [@three-onefouronefive](https://github.com/three-onefouronefive)
- Vince Cyrel A. Jurado --- **Backend** --- [@juradovince15-cmyk](https://github.com/juradovince15-cmyk)
- Nhelmar R. Pahila --- **Frontend** --- [@Nhell1167](https://github.com/Nhell1167)
- Juter R. Blanco  --- **Frontend** --- [@imj-blnc](https://github.com/imj-blnc)
- Jeferson Lark L. Manatad --- **Frontend** --- [@Jefersoninja](https://github.com/Jefersoninja)

*See also the list of contributors who participated in this project.*
