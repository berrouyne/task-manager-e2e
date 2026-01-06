# Logic / Functional Bug Report
Task Manager Application

---

## Issue 1: Task updates are not always persisted after page refresh

**Environment**
- OS: Windows 11
- Browser: Chrome
- Page: /dashboard

**Steps to Reproduce**
1. Go to the dashboard
2. Create a new task
3. Edit the task (change priority or status)
4. Refresh the page

**Expected Behavior**
- The task should keep all updated values after refreshing the page.

**Actual Behavior**
- In some cases, the task reverts to its previous state after refresh.

**Impact**
- High (risk of losing user changes)

**Evidence**
- Observed during manual testing and Task 2 Playwright execution

---

## Issue 2: Task creation does not clearly handle delayed backend responses

**Environment**
- OS: Windows 11
- Browser: Chrome
- Page: /dashboard

**Steps to Reproduce**
1. Create a task with valid data
2. Simulate slow network or delayed backend response

**Expected Behavior**
- The UI should show loading feedback or confirmation once the task is fully created.

**Actual Behavior**
- Task may appear only after a delay or after page refresh, without any indication of processing.

**Impact**
- Medium (confusing user experience)

**Evidence**
- Observed during CI runs and slow response scenarios

---

## Issue 3: Editing a task does not clearly confirm which task was updated

**Environment**
- OS: Windows 11
- Browser: Chrome
- Page: /dashboard

**Steps to Reproduce**
1. Create multiple tasks
2. Edit the priority of one task
3. Save changes

**Expected Behavior**
- The updated task should be clearly identified and confirmed.

**Actual Behavior**
- Changes are applied silently, making it difficult to confirm which task was modified.

**Impact**
- Medium

**Evidence**
- Manual testing with multiple tasks present

---

## Issue 4: Task deletion does not always immediately update the task list

**Environment**
- OS: Windows 11
- Browser: Chrome
- Page: /dashboard

**Steps to Reproduce**
1. Delete an existing task
2. Observe the task list without refreshing the page

**Expected Behavior**
- The deleted task should be removed from the list immediately.

**Actual Behavior**
- In some cases, the task remains visible until the page is refreshed.

**Impact**
- High (user may think deletion failed)

**Evidence**
- Observed during Task 2 and Task 3 automated testing

---

## Issue 5: Completed task state is not consistently reflected across the UI

**Environment**
- OS: Windows 11
- Browser: Chrome
- Page: /dashboard

**Steps to Reproduce**
1. Mark a task as complete
2. Observe task status and available actions

**Expected Behavior**
- Status text, styling, and available actions should all reflect the completed state consistently.

**Actual Behavior**
- Status text updates, but visual styling or action buttons may not update consistently.

**Impact**
- Low to Medium

**Evidence**
- Observed during completion toggle tests

---

## Issue 6: No clear error handling when backend request fails

**Environment**
- OS: Windows 11
- Browser: Chrome
- Page: /dashboard

**Steps to Reproduce**
1. Simulate a backend error or network failure
2. Attempt to create or edit a task

**Expected Behavior**
- The user should see a clear error message explaining that the operation failed.

**Actual Behavior**
- No visible feedback is shown; the user cannot tell if the action succeeded or failed.

**Impact**
- High (silent failures, poor reliability)

**Evidence**
- Inferred from negative testing and CI instability

---

## Notes
- Issues were identified through manual testing, Playwright E2E tests, and CI execution.
- All reported issues relate to application logic and functional behavior rather than UI design.
