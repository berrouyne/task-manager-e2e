## 🛠 Tech Stack

* **Framework:** [Playwright](https://playwright.dev/)
* **Language:** TypeScript
* **Runtime:** Node.js
* **Containerization:** Docker
* **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```text
.
├── tests/
│   ├── auth.spec.ts            # Authentication flows
│   ├── tasks.spec.ts           # CRUD happy path scenarios
│   └── tasks-negative.spec.ts  # Edge cases and error handling
├── reports/                    # (Generated) Test execution reports
├── ui-ux-bug-report.md         # Documentation of UI/UX defects
├── logic-issues-bug-report.md  # Documentation of functional defects
├── playwright.config.ts        # Playwright configuration
├── Dockerfile                  # Container definition for CI
└── README.md
🚀 Setup & Installation
Local Setup
Install dependencies:

Bash

npm install
Install Playwright browsers:

Bash

npx playwright install
Running Tests
Run all tests:

Bash

npx playwright test
Run a specific test file:

Bash

npx playwright test tests/tasks.spec.ts
Run tests in headed mode:

Bash

npx playwright test --headed
View the HTML report after a run:

Bash

npx playwright show-report
🧪 Test Coverage
1. Authentication
Login flow validation.

Access control to dashboard.

2. Task Management (CRUD – Happy Path)
Create: Adding new tasks.

Edit: Modifying existing tasks.

Complete: Marking tasks as finished.

Delete: Removing tasks.

Backend: Response validation.

3. Negative Scenarios & Edge Cases
Missing required fields.

Invalid input handling.

Character limits and special characters.

Whitespace-only inputs.

🤖 Continuous Integration (CI)
Tests run automatically via GitHub Actions on:

Push to main.

Pull requests.

Details:

Tests are executed inside Docker for environment consistency.

Playwright HTML reports are uploaded as GitHub Actions artifacts.

📝 Bug Reports
This project includes manual QA documentation in addition to automated tests.

UI / UX Bug Report
File: ui-ux-bug-report.md

Includes: Environment details, reproduction steps, impact assessment, and visual evidence.

Logic / Functional Bug Report
File: logic-issues-bug-report.md

Includes: Functional defects, data persistence issues, and edge-case failures.

🎯 Purpose of This Project
This project demonstrates:

Realistic end-to-end testing.

CI-ready automation.

Docker-based test execution.

Professional manual QA analysis and reporting.

It is designed as a practical testing portfolio project.