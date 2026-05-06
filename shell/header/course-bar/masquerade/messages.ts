import { defineMessages } from '../../../../runtime';

const messages = defineMessages({
  ariaLabel: {
    id: 'masqueradeBar.ariaLabel',
    defaultMessage: 'Masquerade bar',
    description: 'Accessible label identifying the masquerade bar region.',
  },
  titleViewCourseIn: {
    id: 'masqueradeBar.viewCourse',
    defaultMessage: 'View course in:',
    description: 'Button to view the course in the studio',
  },
  titleStudio: {
    id: 'masqueradeBar.studio',
    defaultMessage: 'Studio',
    description: 'Button to view in studio',
  },
  failedToLoadOptions: {
    id: 'masqueradeBar.error.failedToLoadOptions',
    defaultMessage: 'Unable to load masquerade options.',
    description: 'Error shown when masquerade options cannot be retrieved from the server.',
  },
  noStudentFound: {
    id: 'masqueradeBar.error.noStudentFound',
    defaultMessage: 'No student with this username or email could be found.',
    description: 'Error shown when masquerading by username and the user does not exist.',
  },
  genericSubmitError: {
    id: 'masqueradeBar.error.genericSubmit',
    defaultMessage: 'An error has occurred; please try again.',
    description: 'Generic error shown when the masquerade submission fails.',
  },
});

export default messages;
