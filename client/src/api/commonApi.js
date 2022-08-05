import axiosClient from './axiosClient';
import api from './API'
const commonApi = {
  cloudinaryUpload : (fileToUpload) => {
    return axiosClient.post(api.UPLOAD, fileToUpload)
}
};
  
  export default commonApi;
  