# Simple Task Manager – End-to-End Testing Project

This repository contains end-to-end (E2E) tests for a Simple Task Manager web application.

The purpose of this project is to demonstrate practical skills in:

- End-to-end test automation
- Test structuring and best practices
- CI integration using Docker and GitHub Actions
- Clear and structured bug reporting

---

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Docker
- GitHub Actions (CI)

---

## Project Structure

```text
.
├── tests/
│   ├── auth.spec.ts
│   ├── tasks.spec.ts
│   ├── tasks-negative.spec.ts
│
├── ui-ux-bug-report.md
├── logic-issues-bug-report.md
├── playwright.config.ts
├── Dockerfile
└── README.md
```

---

## Setup (Local)

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install
```

---

## Running Tests Locally

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test tests/tasks.spec.ts
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### View the HTML report after execution

```bash
npx playwright show-report
```

---

## Continuous Integration (CI)

Tests are executed automatically using GitHub Actions when:

- Pushing to the `main` or `master` branch
- Opening a pull request

### CI Pipeline Overview

- Builds a Docker image for a consistent environment
- Runs Playwright tests inside Docker
- Uploads Playwright HTML reports as CI artifacts

---

## Test Coverage

### Task 1 – Authentication

- Login flow validation
- Access control checks

### Task 2 – Task Management (CRUD)

- Create task
- Edit task
- Mark task as complete
- Delete task

### Task 3 – Negative Scenarios & Edge Cases

- Missing required fields
- Invalid inputs
- Long text handling
- Special characters handling

---

## Bug Reports

The project includes documented bug reports based on testing observations.

### UI / UX Issues

**File:** `ui-ux-bug-report.md`

- Missing user feedback
- Layout and usability problems
- Unclear or inconsistent interactions

### Logic / Functional Issues

**File:** `logic-issues-bug-report.md`

- Data handling issues
- Logical inconsistencies
- Edge-case behavior problems

Each bug report contains:

- Environment details
- Steps to reproduce
- Expected vs actual behavior
- Impact assessment
- Evidence references
