import { Container } from "react-bootstrap";
import ContactPage from "../Pages/ContactPage/ContactPage";
import { Routes, Route, useLocation } from "react-router-dom";
import Menu from "../Menu/Menu";
import UserLoginPage from "../User/UserLoginPage/UserLoginPage";
import AdministratorLoginPage from "../Administrator/AdministratorLoginPage/AdministratorLoginPage";
import AdminDashboard from "../Administrator/Dashboard/AdminDashboard";
import AdminUserList from "../Administrator/Dashboard/AdminUserList";
import AdminAdministratorList from "../Administrator/Dashboard/AdminAdministratorList";
import AdminAdministratorAdd from "../Administrator/Dashboard/AdminAdministratorAdd";
import UserRegisterPage from "../User/UserRegisterPage/UserRegisterPage";
import UserProfile from "../User/Profile/UserProfile";
import HomePage from "../Home/HomePage";
import UserPasswordResetPage from "../User/UserPasswordResetPage/UserPasswordResetPage";
import UserDeactivatePage from "../User/UserDeactivatePage/UserDeactivatePage";
import Footer from "../Footer/Footer";
import FlightsPage from "../Pages/FlightsPage/FlightsPage";
import AppStore from "../../stores/AppStore";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AdminAirportList from "../Administrator/Dashboard/AdminAirportList";
import AdminAircraftList from "../Administrator/Dashboard/AdminAircraftList";
import AdminAirportAdd from "../Administrator/Dashboard/AdminAirportAdd";
import AdminAircraftAdd from "../Administrator/Dashboard/AdminAircraftAdd";
import AdminCountryList from "../Administrator/Dashboard/AdminCountryList";
import AdminCountryAdd from "../Administrator/Dashboard/AdminCountryAdd";
import AdminFlightList from "../Administrator/Dashboard/AdminFlightList";
import AdminFlightAdd from "../Administrator/Dashboard/AdminFlightAdd";

function NotFound() {
  return <ErrorPage statusCode={404} message="Page not found." />;
}

function App() {
  const location = useLocation();
  return (
    <Container className="mt-4">
      <Menu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/search/flights" element={<FlightsPage />} />

        <Route
          path="/auth/administrator/login"
          element={<AdministratorLoginPage />}
        />
        <Route path="/auth/user/login" element={<UserLoginPage />} />
        <Route path="/auth/user/register" element={<UserRegisterPage />} />
        <Route
          path="/auth/user/forgot-password"
          element={<UserPasswordResetPage />}
        />

        <Route path="/profile" element={<UserProfile />} />
        <Route path="/deactivate" element={<UserDeactivatePage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="/admin/dashboard/administrator/list"
          element={<AdminAdministratorList />}
        />
        <Route
          path="/admin/dashboard/administrator/add"
          element={<AdminAdministratorAdd />}
        />

        <Route
          path="/admin/dashboard/airport/list"
          element={<AdminAirportList />}
        />
        <Route
          path="/admin/dashboard/airport/add"
          element={<AdminAirportAdd />}
        />

        <Route
          path="/admin/dashboard/aircraft/list"
          element={<AdminAircraftList />}
        />
        <Route
          path="/admin/dashboard/aircraft/add"
          element={<AdminAircraftAdd />}
        />

        <Route
          path="/admin/dashboard/country/list"
          element={<AdminCountryList />}
        />
        <Route
          path="/admin/dashboard/country/add"
          element={<AdminCountryAdd />}
        />

        <Route
          path="/admin/dashboard/flight/list"
          element={<AdminFlightList />}
        />
        <Route
          path="/admin/dashboard/flight/add"
          element={<AdminFlightAdd />}
        />

        <Route path="/admin/dashboard/user/list" element={<AdminUserList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!location.pathname.includes("/admin/") && <Footer />}
    </Container>
  );
}

export default App;
