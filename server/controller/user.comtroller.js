import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
}

const register = async(req,res, next) =>{
    const {fullName, email, password} = req.body
    if(!fullName || !email || !password){
        return new next(AppError('All fields are required',400));
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return next (new AppError('Email is already exists', 400))
    }

    const user = await User.create({
        fullname,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        }

    })

    if(!user){
        return next(new AppError('User registration failed, please try again',400));
    }
    // TODO: file upload
    await user.save();

    user.password = undefined;


    const token = await user.generateJWTTOKEN();

    res.cookie('token',token, cookieOptions)

    res.status(201).json({
        success: true,
        messege: 'User registered successfully',
        user,
    })
};


const login =async (req,res) =>{
    try{
        const {email, password} = req.body;

    if(!email || !password) {
        return next (new AppError('All fields are required',400));
    }

    const user = await User.findOne({
        email
    }).select('+password');

    if(!user || !user.conparePassword(password)) {
        return next(new AppError('Email or password does not match',400))
    }

    const token = await user.generateJWTTOKEN();
    user.password = undefined;

    res.cookie('token',token, cookieOptions);

    res.status(200).json({
        success: true,
        messege: 'User loggedin successfully',
        user,
    })
    } catch(e) {
        return next(new AppError(e.messege,500));
    }
    
    
};

const logout = (req,res) =>{
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });
};

const getProfile = async (req,res) =>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
        success: true,
        messege: 'User details',
        user
    });
    } catch(e){
        return next(new AppError('Failed to fetch profile  ',500));
    }
};

export {
    register,
    login,
    logout,
    getProfile
}