import Link from "next/link";
import { usePathname } from "next/navigation";

import MobileMenuSheet from "./MobileMenuSheet";

import { useUser } from "@auth0/nextjs-auth0/client";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import Navigation from "./Navigation";
const CreateUserFormDialog = dynamic(
  () => import("~/components/User/CreateUserFormDialog")
);

const Header = () => {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  const { user } = useUser();

  const { data: currentUser, isFetched } = api.user.getCurrentUser.useQuery(
    undefined,
    {
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: !!user,
    }
  );

  return (
    <>
      {user && !currentUser && isFetched && <CreateUserFormDialog />}
      <header className="pointer-events-none fixed flex justify-between z-20 w-full rounded top-0 left-0">
        <h1
          className={`pointer-events-auto text-2xl font-serif tracking-tight md:text-4xl flex justify-center items-center p-4 m-0 md:m-4 ${
            isMapPage ? "md:invisible" : "visible"
          }`}
        >
          <Link href="/">Sad Frogs Studying</Link>
        </h1>
        <div
          role="menubar"
          className="p-4 z-20 gap-4 justify-center items-center font-mono md:m-4 rounded-md hidden md:flex"
        >
          <Navigation />
        </div>

        <div className="font-mono m-4 block md:hidden">
          <MobileMenuSheet />
        </div>
      </header>
    </>
  );
};

export default Header;
