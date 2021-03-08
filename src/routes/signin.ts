import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email')
        .isEmail()
        .withMessage('Email must be valid')
        .optional(),
        body('username')
        .isString()
        .optional(),
        body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ], 
    validateRequest,
    async (req : Request, res : Response) => {
        const { password } = req.body;
        const { email } = req.body || {};
        const { username } = req.body || {};

        const existingUser = await User.findOne({$or: [ {email}, {username}] });

        if(!existingUser){
            throw new BadRequestError('Invalid credentials');
        }

        const passwordMatch = await Password.compareHash(existingUser.password, password);

        if(!passwordMatch){
            throw new BadRequestError('Invalid credentials');
        }

        //Generate JWT
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username
        }, process.env.JWT_KEY!);

        //Store it on session object
        req.session = {
            jwt: userJWT
        };

        res.status(200).send(existingUser);
        }
);

export { router as signinRouter };