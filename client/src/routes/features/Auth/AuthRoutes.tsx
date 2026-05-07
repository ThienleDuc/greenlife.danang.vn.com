import LoginPage from "../../../pages/Auth/LoginPage";

const AuthRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },
];

export default AuthRoutes;
