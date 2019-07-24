import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Product'

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Product',
  },
  Product: {
    id: `${scope}.Product`,
    defaultMessage: 'Product',
  },
  CreateProduct: {
    id: `${scope}.CreateProduct`,
    defaultMessage: 'Create product',
  },
  UpdateProduct: {
    id: `${scope}.UpdateProduct`,
    defaultMessage: 'Update product',
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
  MainPhoto: {
    id: `${scope}.MainPhoto`,
    defaultMessage: 'Main photo',
  },
  NameIsRequired: {
    id: `${scope}.NameIsRequired`,
    defaultMessage: 'Name is required',
  },
  NameMustBeBetweenFrom2To100: {
    id: `${scope}.NameMustBeBetweenFrom2To100`,
    defaultMessage: 'Name must be between from 2 to 100 characters',
  },
  MainPhotoIsRequired: {
    id: `${scope}.MainPhotoIsRequired`,
    defaultMessage: 'Main photo is required',
  },
  MaxSecondaryPhotos: {
    id: `${scope}.MaxSecondaryPhotos`,
    defaultMessage: 'Secondary photos exceeds the limit of 3',
  },
  InvalidQuantity: {
    id: `${scope}.InvalidQuantity`,
    defaultMessage: 'Invalid quantity',
  },
  PriceIsRequired: {
    id: `${scope}.PriceIsRequired`,
    defaultMessage: 'Price is required',
  },
  InvalidPrice: {
    id: `${scope}.InvalidPrice`,
    defaultMessage: 'Invalid price',
  },
  CategoriesIsRequired: {
    id: `${scope}.CategoriesIsRequired`,
    defaultMessage: 'Categories is required',
  },
  Categories: {
    id: `${scope}.Categories`,
    defaultMessage: 'Categories',
  },
  Price: {
    id: `${scope}.Price`,
    defaultMessage: 'Price',
  },
  Quantity: {
    id: `${scope}.Quantity`,
    defaultMessage: 'Quantity',
  },
  SecondaryPhotos: {
    id: `${scope}.SecondaryPhotos`,
    defaultMessage: 'Secondary photos',
  },
  PleaseSelectCategory: {
    id: `${scope}.PleaseSelectCategory`,
    defaultMessage: 'Please select category',
  },
  Description: {
    id: `${scope}.Description`,
    defaultMessage: 'Description',
  },
  Slug: {
    id: `${scope}.Slug`,
    defaultMessage: 'Slug',
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
  Barcode: {
    id: `${scope}.Barcode`,
    defaultMessage: 'Barcode',
  },
})