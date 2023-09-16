import Link from "next/link";

import { Button } from "./UI/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";

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

const Navigation = ({
  forMobile = false,
  onLinkClick,
  username,
}: {
  forMobile?: boolean;
  onLinkClick?: () => void;
  username: string;
}) => {
  const { user, isLoading } = useUser();
  const apiUtils = api.useContext();
  const currentUser = apiUtils.user.getCurrentUser.getData();

  return (
    <>
      {!isLoading && (
        <>
          <Link
            onClick={onLinkClick}
            href="/about"
            className="pointer-events-auto h-fit"
          >
            About
          </Link>
          {!forMobile && <span> | </span>}
          <Link
            onClick={onLinkClick}
            href="/map"
            className="pointer-events-auto h-fit"
          >
            Map
          </Link>
          {!forMobile && <span> | </span>}
          {!user ? (
            /* eslint-disable */
            <a
              onClick={onLinkClick}
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
            <Link
              onClick={onLinkClick}
              href={`/user/${username}`}
              aria-disabled={!username}
              className={`${
                username ? "pointer-events-auto" : "opacity-50 line-through"
              } h-fit`}
            >
              Account
            </Link>
          )}
          {!forMobile && <span> | </span>}
        </>
      )}

      {currentUser ? (
        <CreateStudySpotFormSheet disabled={!currentUser} />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Navigation;
