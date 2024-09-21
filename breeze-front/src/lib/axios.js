import Axios from 'axios'

// Function to retrieve a cookie by its name
const getCookie = id => {

    let value = document.cookie.match('(^|;)?' + id + '=([^;]*)(;|$)');
    return value ? unescape(value[2]) : null;
 
 }

// Create an Axios instance with default configuration
const axios = Axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL, // Backend API URL from environment variables
    headers: {
        'Content-Type': 'application/json', // Specify JSON content type
        Accept: 'application/json', // Accept JSON responses
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include the CSRF token from the cookie
    },
    withCredentials: true, // Send cookies with requests (including CSRF token)
})

export { axios }
