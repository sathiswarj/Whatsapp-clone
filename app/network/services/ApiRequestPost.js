import { ApiPatchServiceWrapper, ApiPostServiceWrapper } from "../wrapperService";
import { API_ENDPOINT } from "./ApiEndPoint";

export const ApiRequestPost = {
    updateUserData: (formData) => {

        return new Promise((resolve, reject) => {
            ApiPatchServiceWrapper({
                url: `${API_ENDPOINT.basePath}users/${id}`,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: {
                    formData
                },
            })
                .then(resolve)
                .catch(reject)
        })
    },
}