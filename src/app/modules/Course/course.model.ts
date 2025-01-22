
import { model, Schema } from "mongoose";
import { TCourse, TCoursefaculty, TPreRequisiteCourses } from "./course.interface";


// Pre Request Course Schema
const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    },
);

// Course Schema Model
const courseSchema = new Schema<TCourse>(
    {
        title: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },
        prefix: {
            type: String,
            trim: true,
            required: true,
        },
        code: {
            type: Number,
            trim: true,
            required: true,
        },
        credits: {
            type: Number,
            trim: true,
            required: true,
        },
        preRequisiteCourses: [preRequisiteCoursesSchema],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Course = model<TCourse>('Course', courseSchema);


// Course Faculty Schema
const courseFacultySchema = new Schema<TCoursefaculty>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
    },
    faculties: [
        {
            type: Schema.Types.ObjectId,
            ref: 'AcademicFaculty',
        },
    ],
});

// courseFacultySchema.pre('findOne', function (next) {
//     // this.find({ isDeleted: { $ne: true } });
//     next();
// });

export const CourseFaculty = model<TCoursefaculty>(
    'CourseFaculty',
    courseFacultySchema,
);