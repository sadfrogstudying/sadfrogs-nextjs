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
  const pathname = usePathname();
  const isMapPage = pathname === "/map";
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

      <header className="pointer-events-none fixed flex justify-between z-20 w-full rounded top-0 left-0">
        <h1
          className={`pointer-events-auto text-3xl font-serif tracking-tight flex justify-center items-center p-4 m-0 md:m-4 sm:text-4xl ${
            isMapPage ? "md:invisible" : "visible"
          }`}
        >
          <Link href="/">Sad Frogs Studying</Link>
        </h1>
        <div
          role="menubar"
          className="p-4 z-20 gap-4 justify-center items-center font-mono md:m-4 rounded-md hidden md:flex pointer-events-auto"
        >
          <Navigation />
        </div>

        <div className="font-mono m-4 block md:hidden pointer-events-auto">
          <MobileMenuSheet />
        </div>
      </header>
    </>
  );
};

export default Header;
