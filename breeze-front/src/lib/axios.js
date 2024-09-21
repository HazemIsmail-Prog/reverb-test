import Axios from 'axios'

// Function to retrieve a cookie by its name
const getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
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
