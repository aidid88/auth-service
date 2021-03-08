import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';

import { User } from '../models/user';
import { Role } from '../models/role';
import { Permission } from '../models/permission';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get('/api/permission',
    async (req: Request, res: Response) => {
        const permissions = await Permission.find();

        res.status(200).send(permissions);
    }
);

router.post('/api/permission',
    [
        body('name')
        .isString()
        .withMessage('You must provide role name'),
        body('description')
        .isString()
        .withMessage('You must provide description for the role')
    ], 
    validateRequest,
    async (req : Request, res : Response) => {
        const {name, description } = req.body;

        const permission = Permission.build({name, description });
        await permission.save();

        res.status(201).send(permission);
   }
);

export { router as permissionRouter };