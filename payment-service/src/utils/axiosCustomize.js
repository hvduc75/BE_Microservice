import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

// Cấu hình để sử dụng cookie trong request
instance.defaults.withCredentials = true;




// Thêm response interceptor để kiểm tra và lấy refresh token khi access_token hết hạn
instance.interceptors.response.use(
    function (response) {
        // NProgress.done();
        return response && response.data ? response.data : response;
    },
    async function (error) {
        // NProgress.done();
        const { config, response } = error;
        const originalRequest = config;

        
        return response && response.data ? response.data : Promise.reject(error);
    },
);

export default instance;
