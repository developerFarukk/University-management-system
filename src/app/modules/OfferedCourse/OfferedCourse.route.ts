

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './OfferedCourse.validation';
import { OfferedCourseControllers } from './OfferedCourse.controller';

const router = express.Router();


// Create Offer Cource Route
router.post(
    '/create-offered-course',
    validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseControllers.createOfferedCourse,
);

// All Offer Cource Route
router.get('/', OfferedCourseControllers.getAllOfferedCourses);

// Single Offer Course Route
router.get('/:id', OfferedCourseControllers.getSingleOfferedCourses);


export const offeredCourseRoutes = router;