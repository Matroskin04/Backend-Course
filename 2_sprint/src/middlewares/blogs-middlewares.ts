import {body} from "express-validator";


export const validateBodyOfBlog = [

    body('name')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .notEmpty()
        .bail()
        .withMessage('It should not be not empty')

        .isLength({max: 15})
        .withMessage('The name should be sting and its length must be less then 16'),

    body('description')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .notEmpty()
        .bail()
        .withMessage('It should not be not empty')

        .isLength({max: 500})
        .withMessage('The description\'s length must be less then 501'),

    body('websiteUrl')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .bail()
        .withMessage('It should be valid URL')

        .isLength({max: 100})
        .withMessage('The websiteUrl should be URL and its length must be less then 101'),
]
