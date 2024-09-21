import Axios from 'axios'

const axios = Axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
        
    },
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,
})

export { axios }
