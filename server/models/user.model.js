import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken'

const userSchema = new Schema({
    fullname: {
        type: 'String',
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be atleast 5 character'],
        maxLength: [50, 'Name should be less than 50 character']
    },
    email: {
        type: 'String',
        required: [true, 'Email is required'],
        loswercase: true,
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], 
    },
    password: {
        type: 'String',
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be atleast 8 character'],
        select: false
    },
    avatar: {
        public_id: {
            type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
},{
    timestamps: true
});

userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods = {
    generateJWTToken: function(){
        return jwt.sign(
            { id: this._id, role: this.role, subscription: this.subscription},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )
        
    },
    comparePassword: async function (plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password)
    },

}

const User = model('User', userSchema)

export default User;