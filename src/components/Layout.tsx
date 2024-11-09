import { useAuthUser, logout, useDocData } from "@/fiebase/dbHooks";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import { Loader } from "@/components/UI/Loader";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { LoggedInUserAtom } from "@/state";
import { toast } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthUser();
  const setLoggedInUser = useSetRecoilState(LoggedInUserAtom);
  const r = useRouter();
  const [loggedInUser] = useDocData<Account>(`users/${user?.uid}`);

  useEffect(() => {
    if (loggedInUser && user?.uid) {
      if (loggedInUser.isActive) {
        setLoggedInUser({ id: user.uid, ...loggedInUser });
        return;
      }
      toast.error(
        "This account is disabled. Please connect with administrator."
      );
      logout();
    }
  }, [loggedInUser, setLoggedInUser, user?.uid]);

  if (loading) return <Loader />;

  if (!user) {
    r.push("/login");
    return <></>;
  }

  if (!loggedInUser) return <Loader />;

  return (
    <>
      <Navbar />
      <main className={`m-4 mt-8 flex flex-col  sm:mx-auto lg:max-w-[1000px]`}>
        {children}
      </main>
    </>
  );
};

export default Layout;
