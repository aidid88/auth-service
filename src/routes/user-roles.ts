import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';

import { User } from '../models/user';
import { Role } from '../models/role';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/:id/roles',
    [
        body('roleSet')
        .notEmpty()
        .withMessage('Roles must not be empty')
    ], 
    async (req : Request, res : Response) => {

        const { roleSet } = req.body; 

        
        if(!req.params.id){
            throw new BadRequestError('Invalid id');
        }

        const userId = req.params.id;
        const createdRole:any = await Role.insertMany(roleSet);
        const roles = createdRole.map((element: { _id: any; }) => element._id);
        const user = await User.findOne({_id: userId});
        if(!user){
            res.status(404).send('Invalid user id');
        }
        user!.roles = roles;
        user?.save();
        res.status(200).send(user);
    }
);

export { router as userRoleRouter };