# Testing Folder

This directory contains all automated tests for the Hospital Management project.
It includes unit tests, integration tests, API tests and end-to-end tests.

## Setup

1. `cd testing`
2. `npm install` (already executed earlier but run again if dependencies change)

## Available Scripts

- `npm run test` – run all Jest tests and collect coverage
- `npm run test:watch` – watch mode for Jest
- `npm run frontend:test` – run only frontend-related Jest tests
- `npm run backend:test` – run only backend-related Jest tests
- `npm run e2e` – execute Playwright end‑to‑end tests

## Configuration

- **Jest**: `jest.config.js` is configured for `ts-jest` and collects coverage.
- **Playwright**: `playwright.config.ts` targets `./e2e` directory, headless browsers, and uses `FRONTEND_URL` env variable if provided.
- **TypeScript**: `tsconfig.json` is setup for tests and includes type definitions for jest, node, and Playwright.

## Writing Additional Tests

- Add unit/component tests under `frontend/` using React Testing Library.
- Add service or util tests under `backend/` using Supertest or plain jest.
- End‑to‑end scenarios should live in `e2e/` and use Playwright's `test` API.

## Test Report

After running the full suite, update `TEST_REPORT.md` with actual pass/fail statistics and any discovered issues.

## Notes

- The backend API tests expect a running Spring Boot server at `http://localhost:8080/api` and an existing test user.
- The E2E tests assume the frontend is served (e.g. `npm run dev` in `frontend`), and the backend token is valid.

Reference the original requirements for areas to cover (forms, routing, database operations, role restrictions, edge cases, etc.).
