/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from 'react';

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:8080';

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };

    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case 'city/created':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };

    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        cities: state.cities.filter(
          (city) => city.id !== action.payload
        ),
        isLoading: false,
      };

    default:
      throw new Error('Unknown action type');
  }
}

export const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: 'loading' });

        const res = await fetch(`${BASE_URL}/cities`);

        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading data...',
        });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      // id is a string
      if (Number(id) === currentCity.id) return;

      dispatch({ type: 'loading' });

      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);

        const data = await res.json();

        dispatch({ type: 'city/loaded', payload: data });
      } catch {
        dispatch({
          type: 'city/loaded',
          payload: 'There was an error loading cities...',
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      // To avoid refreshing of page
      dispatch({ type: 'city/created', payload: data });
    } catch {
      dispatch({
        type: 'city/loaded',
        payload: 'There was an error creating cities...',
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      dispatch({
        type: 'city/loaded',
        payload: 'There was an error deleting cities...',
      });
    }
  }

  const value = useMemo(() => {
    return {
      cities,
      isLoading,
      getCity,
      currentCity,
      createCity,
      deleteCity,
      error,
    };
  }, [cities, isLoading, currentCity, error]);

  return (
    <CitiesContext.Provider value={value}>
      {children}
    </CitiesContext.Provider>
  );
};

export const useCities = () => {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error('AuthContext was used outside the Auth provider');

  return context;
};
