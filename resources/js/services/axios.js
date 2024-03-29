import Axios from "axios";
import store from "../store";
import { showToastMessage } from "../actions/toastMessageActions";
import { logout as adminLogout } from "../actions/admin/authActions";

const axios = Axios.create({
    baseURL: process.env.MIX_API_URL
});

const csrfToken = document.head.querySelector('meta[name="csrf-token"]');

if (csrfToken && csrfToken.getAttribute("content")) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken.getAttribute(
        "content"
    );
}

const bearerToken = localStorage.getItem("token");

if (bearerToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${bearerToken}`;
}

axios.interceptors.response.use(
    response => response,
    err => {
        if (err.response) {
            const response = err.response;
            switch (response.status) {
                case 401:
                    //@TODO: check for login type (admin or normal user) and
                    //dispatch appropriate action
                    store.dispatch(adminLogout());
                    break;
                case 403:
                    //@TODO: maybe redirect to unauthorized error page.
                    store.dispatch(
                        showToastMessage(
                            "You don't have permission to access the specified resource!",
                            "error"
                        )
                    );
                    break;
            }
        }

        return Promise.reject(err);
    }
);

export default axios;
