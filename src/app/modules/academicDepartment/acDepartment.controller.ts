
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './acDepartment.service';


// Ceate AcademicDepartments
const createAcademicDepartmemt = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department is created succesfully',
        data: result,
    });
});


// All get AcademicDepartments
const getAllAcademicDepartments = catchAsync(async (req, res) => {

    const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic departments are retrieved successfully',
        // meta: result.meta,
        data: result,
    });
});


// Single get AcademicDepartments
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result =
        await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
            departmentId,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department is Single data get succesfully',
        data: result,
    });
});


// Update department data
const updateAcademicDeartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
            departmentId,
            req.body,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department is updated succesfully',
        data: result,
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartmemt,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDeartment,
};