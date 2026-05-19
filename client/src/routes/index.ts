import HomeRoutes from "./features/Home/HomeRoutes";
import KeHoachRoutes from "./features/TheoDoiTrangThaiKeHoach/KeHoachRoutes";
import AuthRoutes from "./features/Auth/AuthRoutes";
import PheDuyetRoutes from "./features/PheDuyetKeHoach/PheDuyetRoutes";
import ThongKeRoutes from "./features/XemThongKeXuatBaoCao/ThongKeRoutes";

// Tổng hợp tất cả routes
const allRoutes = [
  ...HomeRoutes,
  ...KeHoachRoutes,
  ...AuthRoutes,
  ...PheDuyetRoutes,
  ...ThongKeRoutes,
];

// Public routes (không cần đăng nhập)
export const publicRoutes = allRoutes.filter(route => route.isPublic === true);

// Private routes (cần đăng nhập)
export const privateRoutes = allRoutes.filter(route => route.isPublic === false);

export default allRoutes;