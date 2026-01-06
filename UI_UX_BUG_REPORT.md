# UI / UX Bug Report
Task Manager Application

====================================

Issue 1: No validation message when creating a task without a title

Environment:
- OS: Windows 11
- Browser: Google Chrome
- Screen Resolution: 1920 × 1080
- Page: /dashboard

Steps to Reproduce:
1. Open the dashboard page
2. Leave the task title field empty
3. Fill the description field
4. Select a priority
5. Click the "Add Task" button

Expected Behavior:
- The application should display a clear validation message indicating that the task title is required.

Actual Behavior:
- The task is not created, but no validation or error message is shown to the user.

Impact:
- Medium – users may be confused because there is no feedback explaining why the task was not created.

Evidence:
- Observed during negative scenario testing (Task 3).

------------------------------------

Issue 2: Edit task form is partially hidden on small screens

Environment:
- OS: Windows 11
- Browser: Google Chrome
- Screen Size: Laptop / small browser window
- Page: /dashboard

Steps to Reproduce:
1. Open the dashboard
2. Click the "Edit" button on any task
3. Reduce the browser window height

Expected Behavior:
- The edit form should remain fully visible or be scrollable.

Actual Behavior:
- The "Save Changes" button can be partially hidden and difficult to access.

Impact:
- Medium – affects usability on smaller screens and laptops.

Evidence:
- Observed during Playwright test recordings.

------------------------------------

Issue 3: No visual feedback after successful task creation

Environment:
- OS: Windows 11
- Browser: Google Chrome
- Screen Resolution: 1920 × 1080
- Page: /dashboard

Steps to Reproduce:
1. Create a task with valid inputs
2. Click the "Add Task" button

Expected Behavior:
- A confirmation message or visual feedback should indicate successful task creation.

Actual Behavior:
- The task appears in the list without any confirmation or success message.

Impact:
- Low to Medium – users may be unsure whether the action succeeded.

Evidence:
- Observed during Task 2 (CRUD) testing.

------------------------------------

Issue 4: Priority change after edit is not clearly noticeable

Environment:
- OS: Windows 11
- Browser: Google Chrome
- Screen Resolution: 1920 × 1080
- Page: /dashboard

Steps to Reproduce:
1. Edit an existing task
2. Change the priority value
3. Save changes

Expected Behavior:
- The updated priority should be clearly highlighted or confirmed.

Actual Behavior:
- The change is subtle and easy to miss.

Impact:
- Low – functionality works, but UX clarity could be improved.

Evidence:
- Manual observation during testing.

------------------------------------

Issue 5: Delete confirmation dialog lacks task context

Environment:
- OS: Windows 11
- Browser: Google Chrome
- Screen Resolution: 1920 × 1080
- Page: /dashboard

Steps to Reproduce:
1. Click the "Delete" button on a task

Expected Behavior:
- The confirmation dialog should include the task name being deleted.

Actual Behavior:
- The dialog is generic and does not mention which task will be removed.

Impact:
- Medium – increases risk of accidental deletion.

Evidence:
- Browser confirmation dialog observed during testing.
