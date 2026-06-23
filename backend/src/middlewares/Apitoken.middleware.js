import tokenProvider from "../providers/token/token.provider.js";
import ApiResponse from "../utils/apiResponse.util.js"
export async function ApiTokenVerify(req,res,next) {
    try {
        const ApiToken = req.cookies.ApiToken;
        
        if (!ApiToken) {
            return ApiResponse.error(res,"<<< ApiToken is Required. >>>",400)
        }

        

        const decryptToken = await tokenProvider.decrypt_Api_Token(ApiToken);
        

        req.apiToken = decryptToken;
        
        next()
    } catch (err) {
        return ApiResponse.error(res,`<<< E.R.R.O.R :- ${err.message} >>>`)
    }
}