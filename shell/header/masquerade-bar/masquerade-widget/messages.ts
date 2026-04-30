import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  genericError: {
    id: 'masquerade-widget.userName.error.generic',
    defaultMessage: 'An error has occurred; please try again.',
    description: 'Message shown after a general error when attempting to masquerade',
  },
  fetchError: {
    id: 'masquerade-widget.error.fetch',
    defaultMessage: 'Unable to get masquerade options',
    description: 'Message shown when the masquerade options cannot be loaded',
  },
  placeholder: {
    id: 'masquerade-widget.userName.input.placeholder',
    defaultMessage: 'Username or email',
    description: 'Placeholder text to prompt for a user to masquerade as',
  },
  userNameLabel: {
    id: 'masquerade-widget.userName.input.label',
    defaultMessage: 'Masquerade as this user',
    description: 'Label for the masquerade user input',
  },
  titleViewAs: {
    id: 'instructor.toolbar.view.as',
    defaultMessage: 'View this course as:',
    description: 'Button to view this course as',
  },
  titleStaff: {
    id: 'instructor.toolbar.staff',
    defaultMessage: 'Staff',
    description: 'Button Staff',
  },
  submit: {
    id: 'masquerade-widget.userName.submit',
    defaultMessage: 'Submit',
    description: 'Label for the masquerade submit button',
  },
  submitting: {
    id: 'masquerade-widget.userName.submitting',
    defaultMessage: 'Submitting…',
    description: 'Label for the masquerade submit button while pending',
  },
});

export default messages;
