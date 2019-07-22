import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Categories'

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Product Categories',
  },
  CreateCategory: {
    id: `${scope}.CreateCategory`,
    defaultMessage: 'Create category',
  },
  UpdateCategory: {
    id: `${scope}.UpdateCategory`,
    defaultMessage: 'Update category',
  },
  Create: {
    id: `${scope}.Create`,
    defaultMessage: 'Create',
  },
  Update: {
    id: `${scope}.Update`,
    defaultMessage: 'Update',
  },
  Cancel: {
    id: `${scope}.Cancel`,
    defaultMessage: 'Cancel',
  },
  Name: {
    id: `${scope}.Name`,
    defaultMessage: 'Name',
  },
  Slug: {
    id: `${scope}.Slug`,
    defaultMessage: 'Slug',
  },
  Parent: {
    id: `${scope}.Parent`,
    defaultMessage: 'Parent',
  },
  Photo: {
    id: `${scope}.Photo`,
    defaultMessage: 'Photo',
  },
  ListCategories: {
    id: `${scope}.ListCategories`,
    defaultMessage: 'List categories',
  },
  No: {
    id: `${scope}.No`,
    defaultMessage: 'No.',
  },
  Action: {
    id: `${scope}.Action`,
    defaultMessage: 'Action',
  },
  PleaseSelectParentCategory: {
    id: `${scope}.PleaseSelectParentCategory`,
    defaultMessage: 'Please select parent category',
  },
  NameIsRequired: {
    id: `${scope}.NameIsRequired`,
    defaultMessage: 'Name is required',
  },
  NameMustBeBetweenFrom2To100: {
    id: `${scope}.NameMustBeBetweenFrom2To100`,
    defaultMessage: 'Name must be between from 2 to 100 characters',
  },
  PhotoIsRequired: {
    id: `${scope}.PhotoIsRequired`,
    defaultMessage: 'Photo is required',
  },
  FillOutName: {
    id: `${scope}.FillOutName`,
    defaultMessage: 'Fill out name',
  },
  SlugIsRequired: {
    id: `${scope}.SlugIsRequired`,
    defaultMessage: 'Slug is required',
  },
  SlugIsUnique: {
    id: `${scope}.SlugIsUnique`,
    defaultMessage: 'Slug is unique for SEO, does not encourage self-editing',
  },
  SlugIsInvalid: {
    id: `${scope}.SlugIsInvalid`,
    defaultMessage: 'The Slug does not contain spaces and special characters',
  },
})