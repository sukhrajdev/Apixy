import ApiResponse from "../utils/apiResponse.util.js";
import userService from "../services/user.service.js";


export async function getMe(req, res) {
  try {
    const id = req.user.id;
    const user = await userService.getME(id);
    if (Object.keys(user ?? 0).length == 0) {
      return ApiResponse.error(res, `<<< User not found. >>>`, 404);
    }
    return ApiResponse.success(
      res,
      `<<< Successfullly Get Me Detials >>>`,
      user,
      200,
    );
  } catch (err) {
    return ApiResponse.error(res, `<<< ${err.message} >>>`, 500);
  }
}

export async function getUser(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return ApiResponse.error(res, `<<< Id is Not provided. >>>`, 400);
    }

    const user = await userService.getME(id);

    if (Object.keys(user ?? 0).length == 0) {
      return ApiResponse.error(res, `<<< User not found. >>>`, 404);
    }
    return ApiResponse.success(
      res,
      "<<< Extract User information successful >>>",
      user,
      200,
    );
  } catch (err) {
    return ApiResponse.error(res, `<<< ERROR: ${err.message} >>>`, 500);
  }
}

export async function updateUser(req, res) {
  try {
    const id = req.user.id;
    const data = req.body;

    console.log(data);
    console.log(data.username);
    console.log(data.email);

    if (!data || Object.keys(data).length === 0) {
      return ApiResponse.error(
        res,
        "<<< Data is not provided >>>",
        400
      );
    }

    if (!data.email && !data.username) {
      return ApiResponse.error(
        res,
        "<<< Email or username is not provided >>>",
        400
      );
    }

    const updatedUser = await userService.updateUser(data, id);

    if (Object.keys(updatedUser || {}).length === 0) {
      return ApiResponse.error(
        res,
        "<<< ERROR OCCUR ❌ >>>",
        400
      );
    }

    return ApiResponse.success(
      res,
      "<<< Successfully Updated User >>>",
      updatedUser,
      200
    );

  } catch (err) {
    return ApiResponse.error(
      res,
      `<<< ${err.message} >>>`,
      500
    );
  }
}

export async function deleteMe(req, res){
    try {
        const id = req.user.id;

        const deleteUser = await userService.deleteUser(id)

        if (Object.keys(deleteUser ?? 0).length == 0 ) {

            return ApiResponse.error(res,`<<< User not found. >>>`,404)
        }

        return ApiResponse.success(res,`<<< Successfully Delete User >>>`,deleteUser,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< E.R.R.O.R: ${err.message} >>>`,500)
    }
}

export async function deleteUser(req, res){
    try {
        const id = req.params.id;

        if (!id) {
            return ApiResponse.error(res,`<<< Id could not found. >>>`,400)
        }

        const deleteUser = await userService.deleteUser(id)

        if (Object.keys(deleteUser ?? 0).length == 0 ) {

            return ApiResponse.error(res,`<<< User not found. >>>`,404)
        }

        return ApiResponse.success(res,`<<< Successfully Delete User >>>`,deleteUser,200)
    } catch (err) {
        return ApiResponse.error(res,`<<< E.R.R.O.R: ${err.message} >>>`,500)
    }
}