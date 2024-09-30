import api from '../api';

const userLogin = async (payload) => {
    try {
      const response = await api.post('/auth/login', payload);
      const { token } = response.data;
  
      localStorage.setItem('token', token);
  
      return  { success: true };
    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data.message);
        return { success: false, message: error.response.data.message }; 
      } else {
        console.error('Login error:', error.message);
        return { success: false, message: 'An unexpected error occurred.' }; 
      }
    }
  };
  
  export { userLogin };