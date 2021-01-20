import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://picnic-basket-1d5b5.firebaseio.com/'
});

export default instance