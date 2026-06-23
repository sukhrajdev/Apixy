import apiService from "../services/api.service.js";
import API_SERVICE from "../services/api.service.js";
import ApiResponse from "../utils/apiResponse.util.js";


export async function createApi(req, res) {
    try {
        const id = req.user.id;
        const provider = req.params.provider;
        const {api_key,name} = req.body;

        if (!id || !provider || !api_key || !name) {
            return ApiResponse.error(res,`<<< Invaild or missing Data >>>`,400)
        }

        console.log(provider)

        const api = await API_SERVICE.createApi(id,name,provider,api_key )
        
        if (!api) {
            return ApiResponse.error(res,`<<< Error occured While creating Api  !!! Please Try Again >>>`,400)
        }

        return ApiResponse.success(res,`<<< Create Api SuccessFully >>>`,api,201)

    } catch (err) {
        return ApiResponse.error(res,err.message,500)
    }
}

export async function getApi(req, res) {
    try {
        const { apiName } = req.body

        const api = await API_SERVICE.getApi(apiName);

        console.log(api);
        
        if (!api) {
            return ApiResponse.error(res,`<<< Api getting Occured Error >>>`,400)
        }

        return ApiResponse.success(res,`<<< Api is Get Successful >>>`,api,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< ${err.message} >>>`,500)
    } 
}

export async function getAllApi(req,res) {
    try {
        const id = req.user.id;
        
        const apis = await apiService.getALLAPI(id);

        if (!apis) {
            return ApiResponse.error(res,`<<< Apis our not founded. >>>`,404)
        }

        return ApiResponse.success(res,`<<< Extract Apis Successful >>>`,apis,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< Error: ${err.message} >>>`,500)
    }
}

export async function LLM(req,res) {
    try {
        const { id } = req.apiToken;
        const { Provider, model, query } = req.body;
        
        if (!Provider || !model || !query) {
            return ApiResponse.error(res,`<<< Missing Data >>>`,400)
        }


        const ai = await apiService.LLM(id, Provider, model, query);

        return ApiResponse.success(res,`<<< Successfully Get Ai Response. >>>`,ai,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< Error: ${err.message} >>>`,500)
    }
}

export async function deleteApi(req,res) {
    try {
        const id = req.user.id;
        const apiId = req.params.apiId;
        if (!apiId) {
            return ApiResponse.error(res,`<<< Api Id couldn't found. >>>`,400)
        }

        const apiKey = await apiService.deleteApi(apiId);

        return ApiResponse.success(res,`<<< Successfully Delete Api >>>`,apiKey,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< ERROR OCCURE:${err.message} >>>`,500)
    }
}

export async function updateApi(req,res) {
    try{
        let apiId = req.params.apiId;
        const data = req.body;

        if (Object.keys(data ?? 0) == 0) {
            return ApiResponse.error(res,`<<< Data not provide. >>>`,200)
        }


        apiId = Number(apiId)

        const updatedApi = await apiService.updateApi(apiId, data);

        return ApiResponse.success(res,`<<< Successfully Updated Api >>>`,updatedApi,200)

    }catch(err){
        return ApiResponse.error(res,`<<< Error: ${err.message} >>>`)
    }
}