import axios from 'axios';

export const fetchUserData = async (token) => {
    const response = await axios.get(`/api/user?token=${token}`);
    return response.data;
};
