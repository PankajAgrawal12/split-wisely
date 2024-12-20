import { FC } from "react";
import Link from "next/link";
import { NavItemType } from "./Nav";
import clsx from "clsx";

interface NavItemProps {
  item: NavItemType;
  isActive?: boolean;
}

const NavItem: FC<NavItemProps> = ({ item, isActive }) => {
  return (
    <Link
      href={item.path}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-primary text-white"
          : "hover:bg-gray-100 text-primary-content",
      )}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.name}</span>
    </Link>
  );
};

export default NavItem;
