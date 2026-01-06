# Simple Task Manager – End-to-End Testing Project

This repository contains end-to-end (E2E) tests for a Simple Task Manager application.  
The goal of this project is to demonstrate practical skills in automated testing, CI integration, and bug reporting using Playwright.

---

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Docker
- GitHub Actions (CI)

---

## Project Structure
.
├── tests/
│ ├── auth.spec.ts
│ ├── tasks.spec.ts
│ ├── tasks-negative.spec.ts
│
├── ui-ux-bug-report.md
├── logic-issues-bug-report.md
├── playwright.config.ts
├── Dockerfile
└── README.md

---

## Setup (Local)

Install dependencies:

```bash
npm install

Install Playwright browsers:
npx playwright install
Running Tests Locally

Run all tests:
npx playwright test
Run a specific test file:
npx playwright test tests/tasks.spec.ts
Run tests in headed mode:
npx playwright test --headed
View the HTML report after execution:
npx playwright show-report

Continuous Integration (CI)

Tests are executed automatically using GitHub Actions when:

Pushing to the main or master branch

Opening a pull request

The CI pipeline:

Builds a Docker image for consistency

Runs Playwright tests inside Docker

Uploads Playwright HTML reports as artifacts

Test Coverage
Task 1 – Authentication

Login flow validation

Access control checks

Task 2 – Task Management (CRUD)

Create task

Edit task

Mark task as complete

Delete task

Task 3 – Negative Scenarios & Edge Cases

Missing required fields

Invalid inputs

Long text handling

Special characters handling

Bug Reports

The project includes documented bug reports based on testing observations:

ui-ux-bug-report.md
UI and usability issues such as missing feedback, layout problems, and unclear interactions.

logic-issues-bug-report.md
Functional and logical issues related to data handling, consistency, and edge cases.

Each report contains:

Environment details

Steps to reproduce

Expected vs actual behavior

Impact assessment

Evidence references

Notes

Tests are written to be CI-safe and deterministic

Serial execution is used where state dependency exists

Explicit waits and assertions are preferred over hard timeouts