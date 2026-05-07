import KeHoachRoutes from "./features/TheoDoiTrangThaiKeHoach/KeHoachRoutes";
import AuthRoutes from "./features/Auth/AuthRoutes";

// Tổng hợp tất cả routes
const allRoutes = [
  ...KeHoachRoutes,
  ...AuthRoutes,
];

// Public routes (không cần đăng nhập)
export const publicRoutes = allRoutes.filter(route => route.isPublic === true);

// Private routes (cần đăng nhập)
export const privateRoutes = allRoutes.filter(route => route.isPublic === false);

export default allRoutes;