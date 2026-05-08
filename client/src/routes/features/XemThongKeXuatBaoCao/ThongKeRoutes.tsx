import ThongKeBaoCaoPage from "../../../pages/ThongKe/ThongKeBaoCaoPage";

const ThongKeRoutes = [
  {
    path: "/thong-ke-bao-cao",
    element: <ThongKeBaoCaoPage />,
    isPublic: false,
    allowedRoles: ["CBQL", "QTHT"],
  },
];

export default ThongKeRoutes;
