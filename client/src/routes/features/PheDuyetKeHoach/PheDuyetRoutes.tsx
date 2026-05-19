import PheDuyetKeHoachDetail from "../../../pages/PheDuyetKeHoachDetail";
import { PATHS } from "../../../utils/pathUtils";

const PheDuyetRoutes = [
  {
    path: PATHS.QUAN_LY.CHI_TIET_KE_HOACH,
    element: <PheDuyetKeHoachDetail />,
    isPublic: false,
  },
];

export default PheDuyetRoutes;
