import {ApiResponse} from "../../shared/types/electron-api.ts";
import {toast} from "sonner";

export const parseResponse = async <T>(request: Promise<ApiResponse<T>>): Promise<T | undefined> => {
  try {
    const result = await request;
    console.log('Received response:', result);
    if(result.success) {
      toast.success(result.message, {position: "bottom-center"});
    } else {
      toast.error(result.message, {position: "bottom-center"});
    }

    return result.data;
  } catch (error) {
    toast.error('An error occurred while processing the request');
    console.error('Error parsing response:', error);
  }
}
