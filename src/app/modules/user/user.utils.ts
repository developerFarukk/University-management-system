
// year semesterCode 4digit number
import { TAcademicSemester } from '../academicSemester/acSemester.interface';
import { User } from './user.model';


// *******************    Student Genaret ID Funtionality  *********************** //
const findLastStudentId = async () => {
    const lastStudent = await User.findOne(
        {
            role: 'student',
        },
        {
            id: 1,
            _id: 0,
        },
    )
        .sort({
            createdAt: -1,
        })
        .lean();   // quick data load in use of lean

    //2030 01 0001
    return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester | null) => {

    // first time 0000
    //0001  => 1
    let currentId = (0).toString(); // 0000 by deafult

    const lastStudentId = await findLastStudentId();
    // 2030 01 0001
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6); //01;
    const lastStudentYear = lastStudentId?.substring(0, 4); // 2030
    const currentSemesterCode = payload!.code;
    const currentYear = payload!.year;


    if (
        lastStudentId &&
        lastStudentSemesterCode === currentSemesterCode &&
        lastStudentYear === currentYear
    ) {
        currentId = lastStudentId.substring(6); // 00001
    }


    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `${payload!.year}${payload!.code}${incrementId}`;

    return incrementId;
};


// *******************    Admin Genaret ID Funtionality  *********************** //

// Admin ID
export const findLastAdminId = async () => {
    const lastAdmin = await User.findOne(
        {
            role: 'admin',
        },
        {
            id: 1,
            _id: 0,
        },
    )
        .sort({
            createdAt: -1,
        })
        .lean();

    return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
    let currentId = (0).toString();
    const lastAdminId = await findLastAdminId();

    if (lastAdminId) {
        currentId = lastAdminId.substring(2);
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `A-${incrementId}`;
    return incrementId;
};


// *******************    Faculty Genaret ID Funtionality  *********************** //

