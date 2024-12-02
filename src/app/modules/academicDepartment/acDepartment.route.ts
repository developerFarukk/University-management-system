
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './acDepartment.validation';
import { AcademicDepartmentControllers } from './acDepartment.controller';


const router = express.Router();

// Creat Academic department Data
router.post(
    '/create-academic-department',
    validateRequest(
        AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartmemt,
);

// router.get(
//     '/:departmentId',
//     AcademicDepartmentControllers.getSingleAcademicDepartment,
// );

// router.patch(
//     '/:departmentId',
//     validateRequest(
//         AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
//     ),
//     AcademicDepartmentControllers.updateAcademicDeartment,
// );

// router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

export const AcademicDepartmentRoutes = router;