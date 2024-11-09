import { logout } from "@/fiebase/dbHooks";
import { LoggedInUserAtom } from "@/state";
import { roles } from "@/utils/data";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa";
import { useRecoilValue } from "recoil";

const userRoute = {
  name: "Users",
  route: "users",
};

const departmentRoute = {
  name: "Departments",
  route: "departments",
};

const categoryRoute = {
  name: "Categories",
  route: "categories",
};

const closureRoute = {
  name: "Closures",
  route: "closure-dates",
};

const reportRoute = {
  name: "Reports",
  route: "reports",
};

const roleRoutes = {
  [roles.admin]: [userRoute, departmentRoute, closureRoute, reportRoute],
  [roles.qaManager]: [categoryRoute, reportRoute],
  [roles.qaCoordinator]: [userRoute, departmentRoute, reportRoute],
  [roles.staff]: [],
};

const Navbar = () => {
  const loggedInUser = useRecoilValue(LoggedInUserAtom);

  return (
    <div className="navbar bg-base-100 py-3 shadow-md">
      <div className="navbar-start">
        <Link className="btn-ghost btn text-2xl font-bold normal-case" href="/">
          Columbia
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <div className="dropdown-end dropdown">
          <button
            tabIndex={0}
            className="btn-ghost avatar btn flex flex-row items-center space-x-3"
          >
            <div className="placeholder avatar">
              <div className="w-8 rounded-full bg-neutral-focus text-neutral-content">
                <span className="text-xs">{loggedInUser.name[0]}</span>
              </div>
            </div>
            <p className="font-bold text-black">{loggedInUser.name}</p>
            <FaAngleDown />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link title="Feeds" href="/">
                Feeds
              </Link>
            </li>
            {loggedInUser.role &&
              roleRoutes[loggedInUser.role].map((route) => (
                <li key={route.route}>
                  <Link title={route.name} href={`/${route.route}`}>
                    {route.name}
                  </Link>
                </li>
              ))}
            <li onClick={logout}>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
