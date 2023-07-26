import {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'logout':
      return initialState;

    default:
      throw new Error('Action type is unknown!');
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

export const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (!email && !password) return;

    if (
      email === FAKE_USER.email &&
      password === FAKE_USER.password
    ) {
      dispatch({
        type: 'login',
        payload: FAKE_USER,
      });
    }
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  const value = useMemo(() => {
    return { login, logout, isAuthenticated, user };
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) return;

  return context;
}
