/* eslint-disable @typescript-eslint/no-unused-vars */


import httpStatus, { UNAUTHORIZED } from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {

        const token = req.headers.authorization;

        // checking if the token is missing
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        let decoded;

        // checking if the given token is valid
        try {
            decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Unautorized')
        }

        // const decoded = jwt.verify(
        //     token,
        //     config.jwt_access_secret as string,
        // ) as JwtPayload;

        const { role, userId, iat } = decoded;

        // checking if the user is exist
        const user = await User.isUserExistsByCustomId(userId);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
        }

        // checking if the user is already deleted
        const isDeleted = user?.isDeleted;

        if (isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
        }

        // checking if the user is blocked
        const userStatus = user?.status;

        if (userStatus === 'blocked') {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
        }

        if (
            user.passwordChangedAt &&
            User.isJWTIssuedBeforePasswordChanged(
                user.passwordChangedAt,
                iat as number,
            )
        ) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
        }

        // Role Checking Funtion
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized  hi!',
            );
        }

        req.user = decoded as JwtPayload;


        next();

    });
};

export default auth;