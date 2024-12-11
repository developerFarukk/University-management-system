
import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/acSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';


// Admin &  User Creat Function
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
    // create a user object
    const userData: Partial<TUser> = {};

    //if password is not given , use deafult password
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'admin';

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

// Student &  User Creat Function
const createStudentIntoDB = async (password: string, payload: TStudent) => {

    // Create a user object
    const userData: Partial<TUser> = {};

    // If password is not given, use default password
    userData.password = password || (config.default_password as string);

    // Set student role
    userData.role = 'student';

    // find academic semester info
    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    );

    // Start session
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //set  generated id user/student ID
        userData.id = await generateStudentId(admissionSemester);

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session }); // array

        //create a student
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a student (transaction-2)

        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Failed to create student');
    }
};

export const UserServices = {
    createStudentIntoDB,
    createAdminIntoDB
};
