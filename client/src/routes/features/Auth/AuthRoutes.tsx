import LoginPage from "../../../pages/Auth/LoginPage";
import RegisterPage from "../../../pages/Auth/RegisterPage";
import { PATHS } from "../../../utils/pathUtils";

const AuthRoutes = [
  {
    path: PATHS.AUTH.LOGIN,
    element: <LoginPage />,
    isPublic: true,
  },
  {
    path: PATHS.AUTH.REGISTER,
    element: <RegisterPage />,
    isPublic: true,
  },
];

export default AuthRoutes;
