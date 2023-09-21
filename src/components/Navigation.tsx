import Link from "next/link";

import { Button } from "./UI/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { api } from "~/utils/api";

import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "./UI/Avatar";

const UserMenu = dynamic(() => import("~/components/UserMenu"), {
  loading: () => (
    <Avatar>
      <AvatarImage />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  ),
  ssr: false,
});

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
}: {
  forMobile?: boolean;
  onLinkClick?: () => void;
}) => {
  const { user: auth0User, isLoading: auth0UserLoading } = useUser();
  const { data: currentUser } = api.user.getCurrentUser.useQuery(undefined, {
    staleTime: 1 * 1000 * 60 * 60, // 1 hour
    enabled: !!auth0User,
    refetchOnMount: false,
  });

  return (
    <>
      {!auth0User && !auth0UserLoading && (
        <>
          <a
            onClick={onLinkClick}
            href="/api/auth/login"
            className={`h-fit ${
              auth0UserLoading
                ? "pointer-events-none opacity-70"
                : "pointer-events-auto"
            }`}
          >
            Login / Register
          </a>

          {!forMobile && <span> | </span>}
        </>
      )}

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

      {currentUser ? (
        <CreateStudySpotFormSheet disabled={!currentUser} />
      ) : (
        <Loading />
      )}

      <UserMenu onLinkClick={onLinkClick} />
    </>
  );
};

export default Navigation;
