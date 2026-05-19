import ThongKeBaoCaoPage from "../../../pages/ThongKe/ThongKeBaoCaoPage";
import { PATHS } from "../../../utils/pathUtils";

const ThongKeRoutes = [
  {
    path: PATHS.QUAN_LY.THONG_KE,
    element: <ThongKeBaoCaoPage />,
    isPublic: false,
  },
];

export default ThongKeRoutes;
