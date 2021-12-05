import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_ENDPOINT,
    timeout: 1000,
    auth: {
        username: 'admin',
        password: 'secret'
    }
});
