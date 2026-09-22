import { defineMessages } from '../../runtime';

const messages = defineMessages({
  languageMenuToggle: {
    id: 'languageMenu.toggle.label',
    defaultMessage: 'Change language: {language}',
    description: 'Accessible label for the language menu toggle, which is marked with a globe icon.',
  },
  languageSaveError: {
    id: 'languageMenu.error.languageSave',
    defaultMessage: 'We could not save your language preference.',
    description: 'Error shown when saving the site language preference fails.',
  },
});

export default messages;
