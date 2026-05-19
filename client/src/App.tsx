import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TestUserRoutes from "./routes/TestUserRoutes";
import MainLayout from "./layouts/MainLayout";
import { publicRoutes, privateRoutes } from "./routes";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { PATHS } from "./utils/pathUtils";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes will be dynamically generated from publicRoutes and privateRoutes */}

        {/* Public Routes */}
        {publicRoutes.map((route, index) => (
          <Route 
            key={`public-${index}`} 
            path={route.path} 
            element={
              <PublicRoute>
                {route.element}
              </PublicRoute>
            } 
          />
        ))}

        {/* Redirect "/" về trang chính */}
        <Route path="/" element={<Navigate to="/theo-doi-ke-hoach" replace />} />

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
                <PrivateRoute>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}
        </Route>

        {/* 404 */}
        <Route path={PATHS.AUTH.NOT_FOUND} element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  );
};

export default App;