import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestUserRoutes from "./routes/TestUserRoutes";
import MainLayout from "./layouts/MainLayout";
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "./routes/PrivateRoute";
import { Navigate } from "react-router-dom";

const App = () => {
  const isAuthenticated = false; // Set to false to show login page
  
  return (
    <Router>
      <Routes>
        {/* Redirect from root to login or dashboard */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/theo-doi-ke-hoach" : "/login"} replace />} />

        {/* Public Routes */}
        {publicRoutes.map((route, index) => (
          <Route key={`public-${index}`} path={route.path} element={route.element} />
        ))}

        {/* TestUser routes */}
        {TestUserRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Private Routes với MainLayout */}
        <Route element={<MainLayout />}>
          {privateRoutes.map((route, index) => (
            <Route
              key={`private-${index}`}
              path={route.path}
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;