import { ApiGetServiceWrapper } from "../wrapperService";
import { API_ENDPOINT } from "./ApiEndPoint";

export const ApiRequestGet = {
    getUserData: async () =>{
        try {
            return await ApiGetServiceWrapper({
                url: API_ENDPOINT.basePath + `users/${phoneNumber}`,
                headers:{
                    "Content-Type":"application/json"
                },
            })
        } catch (error) {
           throw new Error(error.message) 
        }
    }
}