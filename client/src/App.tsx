import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestUserRoutes from "./routes/TestUserRoutes";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* TestUser routes */}
        {TestUserRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  );
};

export default App;