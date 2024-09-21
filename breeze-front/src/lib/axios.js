import Axios from 'axios'

const axios = Axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
    },
    withCredentials: true,
    // withXSRFToken: true,
})

export { axios }
