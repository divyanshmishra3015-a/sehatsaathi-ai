import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: Record<UserRole, User> = {
  patient: {
    id: 'usr_pat_01',
    name: 'Sunita Devi',
    email: 'sunita.devi@janswasthya.org',
    role: 'patient',
    phone: '+91 98765 43210',
    village: 'Cholapur, Tola 2',
    district: 'Varanasi',
    abha_id: '91-2345-6789-0123'
  },
  asha_worker: {
    id: 'usr_asha_01',
    name: 'Radha Maurya (ASHA)',
    email: 'radha.asha@janswasthya.org',
    role: 'asha_worker',
    phone: '+91 94150 11223',
    village: 'Cholapur Cluster',
    district: 'Varanasi',
    assigned_phc: 'PHC Cholapur'
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. V. K. Sharma (CMO)',
    email: 'dr.sharma@healthdept.gov.in',
    role: 'admin',
    phone: '+91 94500 99887',
    district: 'Varanasi Division'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('janswasthya_user') || localStorage.getItem('sehatsaathi_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.patient;
      }
    }
    return DEMO_USERS.patient; // Default to patient for seamless demo experience
  });

  const role: UserRole = currentUser?.role || 'patient';

  const loginAs = (newRole: UserRole) => {
    const user = DEMO_USERS[newRole];
    setCurrentUser(user);
    localStorage.setItem('janswasthya_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('janswasthya_user');
    localStorage.removeItem('sehatsaathi_user');
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('janswasthya_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        loginAs,
        logout,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
