
import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();

// router.post('/create-student', StudentControllers.createStudent);

// All Student date get Route
router.get('/', StudentControllers.getAllStudents);

// Single student data get route
router.get('/:id', StudentControllers.getSingleStudent);

// Delete student data get route
router.delete('/:id', StudentControllers.deleteStudent);

// Update Route
router.patch(
    '/:id',
    validateRequest(updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

// router.put('/:studentId', StudentControllers.updateStudent);



export const StudentRoutes = router;