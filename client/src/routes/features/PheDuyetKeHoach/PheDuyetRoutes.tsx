import { Navigate } from "react-router-dom";
import PheDuyetKeHoachDetail from "../../../pages/PheDuyetKeHoachDetail";

const PheDuyetRoutes = [
  {
    path: "/phe-duyet-ke-hoach",
    element: <Navigate to="/phe-duyet-ke-hoach/KH01" replace />,
    isPublic: false,
  },
  {
    path: "/phe-duyet-ke-hoach/:id",
    element: <PheDuyetKeHoachDetail />,
    isPublic: false,
  },
];

export default PheDuyetRoutes;
