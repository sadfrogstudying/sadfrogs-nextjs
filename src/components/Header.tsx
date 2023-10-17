import Link from "next/link";
import { usePathname } from "next/navigation";

import MobileMenuSheet from "./MobileMenuSheet";

import Navigation from "./Navigation";
import { api } from "~/utils/api";
import { useUser } from "@auth0/nextjs-auth0/client";

import dynamic from "next/dynamic";

const CreateUserFormDialog = dynamic(
  () => import("~/components/User/CreateUserFormDialog")
);

const Header = () => {
  const { user: auth0User } = useUser();
  const { data: currentUser, isLoading } = api.user.getCurrentUser.useQuery(
    undefined,
    {
      staleTime: 1 * 1000 * 60 * 60, // 1 hour
      enabled: !!auth0User,
      refetchOnMount: false,
    }
  );

  return (
    <>
      {!!auth0User && !currentUser && !isLoading && <CreateUserFormDialog />}

      <header className="fixed pointer-events-none flex justify-between z-20 w-full rounded top-0 left-0">
        <Logo />

        <div
          role="menubar"
          className="p-4 gap-4 justify-center items-center font-mono m-4 rounded-md hidden lg:flex pointer-events-auto bg-white"
        >
          <Navigation />
        </div>

        <div className="font-mono m-8 block lg:hidden pointer-events-auto mr-8">
          <MobileMenuSheet />
        </div>
      </header>
    </>
  );
};

export default Header;

const Logo = () => {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  return (
    <h1
      className={`font-mono text-lg pointer-events-auto flex justify-center items-center p-4 m-4 relative z-10 ml-4 transition-opacity ${
        isMapPage ? "md:invisible" : "visible"
      }`}
    >
      <Link href="/">
        International<strong>StudySpots</strong>
      </Link>
    </h1>
  );
};
