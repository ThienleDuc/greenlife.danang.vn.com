import LoginPage from "../../../pages/Auth/LoginPage";
import RegisterPage from "../../../pages/Auth/RegisterPage";

const AuthRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    isPublic: true,
  },
];

export default AuthRoutes;
