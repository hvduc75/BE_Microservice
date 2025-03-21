import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_EVENT_SERVICE_URL, 
    withCredentials: true, 
});

// **Xử lý response, đặc biệt là lỗi 401 (Unauthorized)**
instance.interceptors.response.use(
    function (response) {
        return response && response.data ? response.data : response;
    },
    async function (error) {
        const { config, response } = error;
        const originalRequest = config;

        // **Nếu lỗi 401 (Unauthorized) và không phải request refresh token**
        // if (response && response.status === 401 && !originalRequest._retry) {
        //     if (!isRefreshing) {
        //         isRefreshing = true;

        //         try {
        //             const refresh_token = store?.getState()?.user?.account?.refresh_token;
        //             // Gọi API refresh token
        //             const res = await axios.post(
        //                 `${process.env.REACT_APP_EVENT_SERVICE_URL}/api/v1/auth/refresh_token`,
        //                 { refresh_token },
        //                 { withCredentials: true }
        //             );

        //             if (res && res.data.DT) {
        //                 const newAccessToken = res.data.DT.access_token;
        //                 store.dispatch(UpdateAccessTokenSuccess(newAccessToken));
        //                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        //                 onRefreshed(newAccessToken);
        //                 isRefreshing = false;

        //                 return instance(originalRequest);
        //             }

        //             if (res && res.data.EC !== 0) {
        //                 store.dispatch(UserLogoutSuccess());
        //                 let isLogged = localStorage.getItem('isLogged');
        //                 if (isLogged) {
        //                     window.location.href = '/login';
        //                 }
        //             }
        //         } catch (err) {
        //             isRefreshing = false;
        //             console.log('Lỗi khi refresh token:', err);
        //             return Promise.reject(err);
        //         }
        //     }

        //     // Nếu đang refresh, chờ refresh xong rồi thực hiện lại request
        //     const retryOriginalRequest = new Promise((resolve) => {
        //         addRefreshSubscriber((newToken) => {
        //             originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        //             resolve(instance(originalRequest));
        //         });
        //     });

        //     return retryOriginalRequest;
        // }

        return response && response.data ? response.data : Promise.reject(error);
    },
);

export default instance;
