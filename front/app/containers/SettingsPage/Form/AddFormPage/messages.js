/*
 * AddFormPage Messages
 *
 * This contains all the text for the AddFormPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AddFormPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AddFormPage container!',
  },

  formName: {
    id: `formName`,
    defaultMessage: 'Form Name',
  },
  content: {
    id: `content`,
    defaultMessage: 'Content',
  },
  description: {
    id: `description`,
    defaultMessage: 'Description',
  },
  imageHeader: {
    id: `imageHeader`,
    defaultMessage: 'Image Header',
  },
  chooseFile: {
    id: 'chooseFile',
    defaultMessage: 'Choose File',
  },
  title: {
    id: `title`,
    defaultMessage: 'Title',
  },
  footer: {
    id: `footer`,
    defaultMessage: 'Footer',
  },
  addForm: {
    id: `addForm`,
  },
  btnCancel: {
    id: `cancel`,
  },
  btnAdd: {
    id: `add`,
  },
  btnOk: {
    id: `ok`,
  },
  preview: {
    id: `preview`,
  },
  email: {
    id: `email`,
    defaultMessage: 'Email Address',
  },
  full_name: {
    id: `fullName`,
    defaultMessage: 'Full Name',
  },
  contact_no: {
    id: `contactNo`,
    defaultMessage: 'Contact Number',
  },
});
