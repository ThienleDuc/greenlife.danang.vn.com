import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TestUserRoutes from "./routes/TestUserRoutes";
import MainLayout from "./layouts/MainLayout";
import { privateRoutes } from "./routes";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  const isAuthenticated = true;
  
  return (
    <Router>
      <Routes>

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
              key={index}
              path={route.path}
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}
        </Route>

        {/* 404 - phải để cuối cùng */}
        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  );
};

export default App;