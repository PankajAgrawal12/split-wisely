import { FC } from "react";
import { IconType } from "react-icons";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import NavItem from "./NavItem";

export type NavItemType = {
  name: string;
  icon: IconType;
  path: string;
};

interface NavProps {
  items: NavItemType[];
  className?: string;
}

const Nav: FC<NavProps> = ({ items, className = "" }) => {
  const pathname = usePathname();

  return (
    <nav className={clsx("flex flex-col gap-y-2 mx-2 mt-2", className)}>
      {items.map((item) => (
        <NavItem
          key={item.path}
          item={item}
          isActive={pathname === item.path}
        />
      ))}
    </nav>
  );
};

export default Nav;
