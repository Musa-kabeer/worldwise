import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { CitiesProvider } from './contexts/citiesContext';
import { AuthProvider } from './contexts/FakeAuthContext';

import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import ProtectedRoutes from './Pages/ProtectedRoutes';
import SpinnerFullPage from './components/SpinnerFullPage';

const Homepage = lazy(() => import('./Pages/Homepage'));
const Product = lazy(() => import('./Pages/Product'));
const Pricing = lazy(() => import('./Pages/Pricing'));
const PageNotFound = lazy(() => import('./Pages/PageNotFound'));
const AppLayout = lazy(() => import('./Pages/AppLayout'));
const Login = lazy(() => import('./Pages/Login'));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="login" element={<Login />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />

              <Route
                path="app"
                element={
                  <ProtectedRoutes>
                    <AppLayout />
                  </ProtectedRoutes>
                }
              >
                <Route
                  index
                  element={<Navigate replace to="cities" />}
                />

                <Route path="cities" element={<CityList />} />

                <Route path="cities/:id" element={<City />} />

                <Route path="form" element={<Form />} />

                <Route path="countries" element={<CountryList />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
