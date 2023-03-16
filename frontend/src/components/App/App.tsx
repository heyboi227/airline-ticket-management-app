import { Container } from "react-bootstrap";
import ContactPage from "../Pages/ContactPage/ContactPage";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Container className="mt-4">
      <Menu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />

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

        <Route path="/admin/dashboard/user/list" element={<AdminUserList />} />
      </Routes>
      <Footer />
    </Container>
  );
}

export default App;
