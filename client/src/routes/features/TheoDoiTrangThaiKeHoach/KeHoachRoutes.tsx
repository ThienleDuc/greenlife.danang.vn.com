import TheoDoiTrangThaiKeHoach from "../../../pages/TheoDoiKeHoach/TheoDoiTrangThaiKeHoach";
import GuiKeHoachCongViec from "../../../pages/GuiKeHoach/GuiKeHoachCongViec";
import ChinhSuaHuyKeHoach from "../../../pages/ChinhSuaKeHoach/ChinhSuaHuyKeHoach";
import { PATHS } from "../../../utils/pathUtils";

const KeHoachRoutes = [
  {
    path: PATHS.KY_THUAT.DASHBOARD,
    element: <TheoDoiTrangThaiKeHoach />,
    isPublic: false,
  },
  {
    path: PATHS.KY_THUAT.LAP_KE_HOACH,
    element: <GuiKeHoachCongViec />,
    isPublic: false,
  },
  {
    path: PATHS.KY_THUAT.CHINH_SUA_KE_HOACH,
    element: <ChinhSuaHuyKeHoach />,
    isPublic: false,
  },
];

export default KeHoachRoutes;
