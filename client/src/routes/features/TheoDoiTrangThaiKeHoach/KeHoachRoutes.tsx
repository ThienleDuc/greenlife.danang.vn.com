import TheoDoiTrangThaiKeHoach from "../../../pages/TheoDoiKeHoach/TheoDoiTrangThaiKeHoach";
import { PATHS } from "../../../utils/pathUtils";

const KeHoachRoutes = [
  {
    path: PATHS.KY_THUAT.DASHBOARD,
    element: <TheoDoiTrangThaiKeHoach />,
    isPublic: false,
  },
];

export default KeHoachRoutes;