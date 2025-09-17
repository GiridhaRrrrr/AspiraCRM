// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { AuthContextType, User } from '@/types';
// import { mockUsers } from '@/data/mockData';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check for existing user session on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem('aspiraCRM_user');
//     if (storedUser) {
//       try {
//         const userData = JSON.parse(storedUser);
//         setUser(userData);
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error('Error parsing stored user data:', error);
//         localStorage.removeItem('aspiraCRM_user');
//       }
//     }
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Check mock users
//     const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
//     if (foundUser) {
//       const { password: _, ...userWithoutPassword } = foundUser;
//       setUser(userWithoutPassword);
//       setIsAuthenticated(true);
//       localStorage.setItem('aspiraCRM_user', JSON.stringify(userWithoutPassword));
//       return true;
//     }
    
//     return false;
//   };

//   const register = async (name: string, email: string, password: string): Promise<boolean> => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Check if user already exists
//     const existingUser = mockUsers.find(u => u.email === email);
//     if (existingUser) {
//       return false; // User already exists
//     }
    
//     // Create new user
//     const newUser: User = {
//       id: `u${Date.now()}`,
//       name,
//       email,
//       createdAt: new Date().toISOString()
//     };
    
//     // Add to mock users array
//     mockUsers.push({ ...newUser, password });
    
//     // Set as current user
//     setUser(newUser);
//     setIsAuthenticated(true);
//     localStorage.setItem('aspiraCRM_user', JSON.stringify(newUser));
    
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('aspiraCRM_user');
//   };

//   const value: AuthContextType = {
//     user,
//     login,
//     register,
//     logout,
//     isAuthenticated
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// --> Import axios to make API calls
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import api from '../lib/api'; 
// --> No longer need mock data
// import { mockUsers } from '@/data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // --> Added a loading state for better UX
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedUser = localStorage.getItem('aspiraCRM_user');
  // Add a check to make sure the stored value is a valid JSON string
  if (storedUser && storedUser !== 'undefined') {
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('aspiraCRM_user');
    }
  }
  setLoading(false);
}, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // --> Make a POST request to your backend login endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      // --> Get user and token from the response
      const { user, token } = response.data;

      // --> Store the token and user data in localStorage
      localStorage.setItem('aspiraCRM_token', token);
      localStorage.setItem('aspiraCRM_user', JSON.stringify(user));

      // --> Update the state
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // --> The API call failed, so login is unsuccessful
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // --> Make a POST request to your backend register endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      // --> Get user and token from the response
      const { user, token } = response.data;

      // --> Store the token and user data
      localStorage.setItem('aspiraCRM_token', token);
      localStorage.setItem('aspiraCRM_user', JSON.stringify(user));
      
      // --> Update the state
      setUser(user);
      setIsAuthenticated(true);
      return true;

    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // --> Make sure to remove both the user and the token
    localStorage.removeItem('aspiraCRM_user');
    localStorage.removeItem('aspiraCRM_token');
  };


const updateUser = async (userData: { name: string; email: string }): Promise<boolean> => {
  try {
    const response = await api.put('/auth/profile', userData);
    const updatedUser = response.data.user;

    // Update the user state in the context
    setUser(updatedUser);
    
    // Also update the user data in localStorage
    localStorage.setItem('aspiraCRM_user', JSON.stringify(updatedUser));

    return true;
  } catch (error) {
    console.error('Failed to update user:', error);
    return false;
  }
};

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    // --> You can also expose the loading state if your UI needs it
    loading,
    updateUser,
  };

  // --> Don't render children until the initial auth check is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};