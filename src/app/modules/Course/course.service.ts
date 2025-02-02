/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCoursefaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";


// Creat Course Function
const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
};

// All Course data Get
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(
        Course.find(),
        // .populate('preRequisiteCourses.course'),
        query,
    )
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const meta = await courseQuery.countTotal();
    const result = await courseQuery.modelQuery;

    return {
        meta,
        result,
    };
};

// Single Course Data Get
const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
    );
    return result;
};

// Delete Course Data
const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
            new: true,
        },
    );
    return result;
};

// Update Course Data
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //step1: basic course info update
        const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session,
            },
        );

        if (!updatedBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
        }

        // check if there is any pre requisite courses to update
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // filter out the deleted fields
            const deletedPreRequisites = preRequisiteCourses
                .filter((el) => el.course && el.isDeleted)
                .map((el) => el.course);

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: { course: { $in: deletedPreRequisites } },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
            }

            // filter out the new course fields
            const newPreRequisites = preRequisiteCourses?.filter(
                (el) => el.course && !el.isDeleted,
            );

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                },
            );

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
            }
        }

        await session.commitTransaction();
        await session.endSession();

        const result = await Course.findById(id).populate(
            'preRequisiteCourses.course',
        );

        return result;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
};

// Assin Course Faculty 
const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCoursefaculty>) => {

    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } },
        },
        {
            upsert: true,
            new: true,
        },
    );
    return result;
};

// Remove faculty
const removeFacultiesFromCourseFromDB = async (
    id: string,
    payload: Partial<TCoursefaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } },
        },
        {
            new: true,
        },
    );
    return result;
};

// Get Faculty with Course
const getFacultiesWithCourseFromDB = async (course: string) => {

    const result = await CourseFaculty.findOne({ course })
        .populate('course')
        .populate('faculties')

    return result;
};



export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB,
    getFacultiesWithCourseFromDB
};