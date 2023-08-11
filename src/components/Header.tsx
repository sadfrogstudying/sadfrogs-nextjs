import Link from "next/link";
import { usePathname } from "next/navigation";

import MobileMenuSheet from "./MobileMenuSheet";

import { Button } from "./UI/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
const CreateUserFormDialog = dynamic(
  () => import("~/components/User/CreateUserFormDialog")
);

const CreateStudySpotFormSheet = dynamic(
  () => import("~/components/StudySpot/Form/CreateForm/CreateFormSheet"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => (
  <Button variant="outline" disabled>
    Create Spot
  </Button>
);

const Header = () => {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  const { user, isLoading } = useUser();

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
          <Link href="/about" className="pointer-events-auto h-fit">
            About
          </Link>
          <span> | </span>
          <Link href="/map" className="pointer-events-auto h-fit">
            Map
          </Link>
          <span> | </span>

          {!user ? (
            <a
              href="/api/auth/login"
              className={`h-fit ${
                isLoading
                  ? "pointer-events-none opacity-70"
                  : "pointer-events-auto"
              }`}
            >
              Login / Register
            </a>
          ) : (
            <Link href="/account" className="pointer-events-auto h-fit">
              Account
            </Link>
          )}

          <span> | </span>

          {currentUser ? (
            <CreateStudySpotFormSheet disabled={!currentUser} />
          ) : (
            <Loading />
          )}
        </div>

        <div className="font-mono m-4 block md:hidden">
          <MobileMenuSheet />
        </div>
      </header>
    </>
  );
};

export default Header;
