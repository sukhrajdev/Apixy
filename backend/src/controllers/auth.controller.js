import ApiResponse from "../utils/apiResponse.util.js";
import AuthService from "../services/auth.service.js";
import authService from "../services/auth.service.js";


const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
}

export async function register(req, res) {

    try {

        const data = req.body;

        // Validate request body
        if (!data || Object.keys(data).length === 0) {

            return ApiResponse.error(
                res,
                "Invalid Data",
                400
            );

        }

        // Register user
        const user = await AuthService.register(data);

        // Success response
        return ApiResponse.success(
            res,
            "User registered successfully",
            user,
            201
        );

    } catch (err) {

        return ApiResponse.error(
            res,
            err.message || "Internal Server Error",
            500
        );


    }

}

export async function login(req,res) {
    try {
        const data = req.body
        if (!data) {
            return ApiResponse.error(res,"Required Data is Not provide.",400)
        }

        if (!data.password) {
            return ApiResponse.error(res,"Password is not provide.",400)
        }

        if (!data.email) {
            return ApiResponse.error(res,"Email is not provide.",400)
        }

        const loggedData = await authService.login(data)

        res.cookie("accessToken", loggedData.accessToken, options)
        .cookie("refreshToken", loggedData.refreshToken, options);
        return ApiResponse.success(res, "Logged User Successful!!", loggedData.user, 200)
    } catch (err) {
        return ApiResponse.error(res, err.message, 500)
        console.log(err.message)
    }
}


export async function logout(req, res) {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!accessToken && !refreshToken) {
            return ApiResponse.error(res,"<<<< You are Already Logout >>>",400)
        }

        const logout = authService.logout(res, accessToken, refreshToken)
        return ApiResponse.success(res,"<<<< Logout Successfull >>>>",null,200)
    } catch (err) {
        return ApiResponse.error(res,`<<<< ${err.message} >>>>`,500)
    }
}

export async function refreshAccessToken(req,res) {
    try {
        const data = req.body;
        const refreshToken = req.cookies.refreshToken

        if (!data || !data.id) {
            return ApiResponse.error(res,"<<<< Invaild Id or Not provide Id >>>>",400)
        }

        if (!refreshToken) {
            return ApiResponse.error(res,"<<<< Refresh Token could not provided >>>>",400)
        }

        const newAccessToken = await authService.refreshAccessToken(refreshToken, data.id)

        

        res.cookie("accessToken", newAccessToken, options)
        
        return ApiResponse.success(res,"<<< Token Renew Successful >>>",null,200)
    } catch (err) {
        return ApiResponse.error(res,`<<<< ${err.message} >>>>`,500)
    }
}

export async function forgetPassword(req,res) {
    try {
        const id = req.user.id; // Extract User Id By Middleware 
        
        const { oldPassword, newPassword } = req.body; // Get Old Password and New Password from Body
        
        // Check Required Fields are Provide.
        if (!newPassword && !oldPassword) {
            return ApiResponse.error(res,"<<<< Required: New Password & Old Password is not provide. >>>>",400)
        }

        // Check New Password length is 8 or Greater then it
        if (newPassword.length < 8) {
            return ApiResponse.error(res,"<<<< Password is Weak. >>>>",400)
        }


        // Call Auth Service Function forgetPassword
        const updatedUser = await AuthService.forgetPassword(oldPassword, newPassword, id)
        
        return ApiResponse.success(res,"<<< Update Password Successful >>>",updatedUser,200) // Send Success Response

    } catch (err) {
        return ApiResponse.error(res,`Error: ${err.message}`,500)
    }
} 

export async function Verifier(req,res) {
    try {
        const verificationToken = req.params.verificationToken;
        if (!verificationToken) {
            return ApiResponse.error(res,`<<< To Verify Email want a Token for it. >>>`,400)
        }

        const verifier = await authService.Verifier(verificationToken);

        return ApiResponse.success(res,`<<< ${verifier} >>>`,null,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< E.r.r.o.r : ${err.message} >>>>`,500)
    }
}