import express, { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';

import { Role } from '../models/role';
import { Permission } from '../models/permission';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get('/api/roles',
    async (req: Request, res: Response) => {
        const roles = await Role.find();

        res.status(200).send(roles);
    }
);

router.post('/api/roles',
    [
        body('name')
        .isString()
        .withMessage('You must provide role name'),
        body('description')
        .isString()
        .withMessage('You must provide description for the role'),
        body('permissionSet')
        .notEmpty()
        .withMessage('You must provide permissions for the role')
    ], 
    validateRequest,
    async (req : Request, res : Response) => {
        const {name, description, permissionSet } = req.body;
       
        try{
            
            const createdPermission:any = await Permission.insertMany(permissionSet);
            const permissions = createdPermission.map((element: { _id: any; }) => element._id);

            const role = Role.build({name, description, permissions});
            await role.save();
            res.status(201).send(role);

        } catch(err){
            throw new BadRequestError('Role cannot be created');
        }
        
   }
);

export { router as roleRouter };