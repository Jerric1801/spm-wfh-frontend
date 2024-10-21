import api from '../api';
import { jwtDecode } from 'jwt-decode'; 

const userLogin = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);
    const { token } = response.data;
    const decodedToken = jwtDecode(token);

    const staffName = decodedToken.Staff_FName + ' ' + decodedToken.Staff_LName;
    const role = decodedToken.Role;
    const country = decodedToken.Country;
    const email = decodedToken.Email;
    const position = decodedToken.Position;

    const staffItems =  {
      staffName: staffName,
      role: role,
      country: country,
      email: email, 
      position: position
    }

    localStorage.setItem('staff', JSON.stringify(staffItems)); 
    localStorage.setItem('token', token);

    return { success: true };
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