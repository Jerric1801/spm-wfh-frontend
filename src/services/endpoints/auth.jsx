import api from '../api';

const userLogin = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        const { token } = response.data;

        localStorage.setItem('token', token);

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Login error:', error.response.data.message);
            return { success: false, message: error.response.data.message };
        } else if (error.request) {
            console.error('Login error: No response received');
            return { success: false, message: 'No response received' };
        } else {
            console.error('Login error:', error.message);
            return { success: false, message: error.message };
        }
    }
};

export {
    userLogin
}