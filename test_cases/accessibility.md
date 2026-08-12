# accessibility

## Covers

- [Test Setup](#test-setup)
- [Scope](#scope)
- [Milestone Switch Accessible Name](#milestone-switch-accessible-name)
- [Dashboard Action Information](#dashboard-action-information)
- [Action Modal Keyboard Focus](#action-modal-keyboard-focus)

## Test Setup

1. Open the portal in Google Chrome on Windows.
2. Press 'Windows + Ctrl + Enter' to start Windows Narrator.
3. Use Tab, Shift + Tab, Enter, and ESC for navigation.

## Scope

Calendar and Gantt accessibility are outside the scope of this test case.

## Milestone Switch Accessible Name

1. Use 'Tab' to reach the Milestones switch.
2. Press 'Space' to change its state.
3. Narrator should announce the switch name and its checked or unchecked state.

Current status: Pass

## Dashboard Action Information

1. Use 'Tab' to reach an action in Milestones.
2. Listen to the action information announced by Narrator.
3. Narrator should announce the action title and relevant details

Current status: Fail. Only "view action".

## Action Modal Keyboard Focus

1. Open an action from Milestones using the keyboard.
2. Confirm that focus moves into the modal.
3. Use 'Tab' and 'Shift + Tab' to reach the View Action button.
4. Confirm that focus does not move to the page behind the modal.

Current status: Partially Pass, the dashboard view action can focus on the modal directly now.