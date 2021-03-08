import mongoose, { Types } from 'mongoose';
import { textSpanContainsPosition } from 'typescript';
import { Password } from '../services/password';

// An interface that describes the properties
// That are required to create a new user
interface UserAttrs {
    email: string;
    username: string;
    password: string;
}

// An interface that describes that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that desribest the properties
// that User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    username: string; 
    password: string;
    roles: Types.ObjectId;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };