import mongoose, { Types } from 'mongoose';
import { textSpanContainsPosition } from 'typescript';

// An interface that describes the properties
// That are required to create a new role
export interface RoleAttrs {
    name: string;
    description: string;
    permissions: [];
}

// An interface that describes that a Role Model has
interface RoleModel extends mongoose.Model<RoleDoc> {
    build(attrs: RoleAttrs): RoleDoc;
}

// An interface that desribest the properties
// that Role Document has
interface RoleDoc extends mongoose.Document {
    name: string;
    description: string; 
    permissions: Types.ObjectId;
}

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

// roleSchema.pre('save', async function(done){
// });

roleSchema.statics.build = (attrs: RoleAttrs) => {
    return new Role(attrs);
};

const Role = mongoose.model<RoleDoc, RoleModel>('Role', roleSchema);

export { Role };