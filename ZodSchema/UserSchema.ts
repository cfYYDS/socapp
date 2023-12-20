import {z} from 'zod'
export const SignUpSchema = z.object({
    username:z.string().min(3,{
        message:"Username must be at least 3 characters long"
    }),
    email:z.string().email().refine(value=>!!value,{
        message:"Email is mandatory and should be a valid email address"
    }),
    password:z.string().min(8,{
        message:"Password must be at least 8 characters long"
    }).max(15,{
        message:"Password must not be more than  15 characters"
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character and be between 8 to 15 characters long.')
    .refine(value=>!!value,{
        message:"Password is mandatory"
    })
    ,
    confirmpassword:z.string().min(8,{
        message:"Password must be at least 8 characters long"
    }).max(15,{
        message:"Password must not be more than  15 characters"
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character and be between 8 to 15 characters long.')
    .refine(value=>!!value,{
        message:"Password is mandatory"
    })
    ,
}).refine((data)=>data.password===data.confirmpassword,{
    message:"Password and Confirm Password must be same",
    path:["confirmpassword"]
})