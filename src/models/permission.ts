import mongoose, { Types } from 'mongoose';
import { textSpanContainsPosition } from 'typescript';

// An interface that describes the properties
// That are required to create a new permission
export interface PermissionAttrs {
    name: string;
    description: string;
}

// An interface that describes that a Permission Model has
interface PermissionModel extends mongoose.Model<PermissionDoc> {
    build(attrs: PermissionAttrs): PermissionDoc;
}

// An interface that desribest the properties
// that Permission Document has
interface PermissionDoc extends mongoose.Document {
    name: string;
    description: string; 
}

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});


permissionSchema.statics.build = (attrs: PermissionAttrs) => {
    return new Permission(attrs);
};

const Permission = mongoose.model<PermissionDoc, PermissionModel>('Permisson', permissionSchema);

export { Permission };