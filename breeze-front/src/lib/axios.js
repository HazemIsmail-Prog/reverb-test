import Axios from 'axios'

// Function to retrieve a cookie by its name
const getCookie = name => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null // Return null if the cookie is not found
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
