import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuUserPen,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  { id: "01", label: "Dashboard", icon: LuLayoutDashboard, path: "/dashboard" },
  { id: "02", label: "Income", icon: LuHandCoins, path: "/income" },
  { id: "03", label: "Expense", icon: LuWalletMinimal, path: "/expense" },
  { id: "04", label: "User", icon: LuUserPen, path: "/user" },
  { id: "05", label: "Logout", icon: LuLogOut, path: "logout" },
];
