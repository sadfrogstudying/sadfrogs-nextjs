import { Popover, PopoverContent, PopoverTrigger } from "./UI/Popover";
import { Avatar, AvatarFallback, AvatarImage } from "./UI/Avatar";
import { api } from "~/utils/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import Link from "next/link";

const UserMenu = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const [open, setOpen] = useState(false);
  const clickHandler = () => {
    setOpen(false);
    onLinkClick?.();
  };

  const { user: auth0User, isLoading: auth0UserLoading } = useUser();
  const { data: currentUser, isLoading } = api.user.getCurrentUser.useQuery(
    undefined,
    {
      staleTime: 1 * 1000 * 60 * 60, // 1 hour
      enabled: !!auth0User,
      refetchOnMount: false,
    }
  );

  type NavigationState =
    | "undetermined"
    | "notLoggedIn"
    | "loggedInNoAccount"
    | "loggedInWithAccount";

  const [authStatus, setAuthStatus] = useState<NavigationState>("undetermined");

  useEffect(() => {
    const getStatus = (): NavigationState => {
      if (auth0UserLoading) return "undetermined";
      if (auth0User && currentUser && !isLoading) return "loggedInWithAccount";
      if (!!auth0User && !currentUser && !isLoading) return "loggedInNoAccount";
      if (!auth0User && !auth0UserLoading) return "notLoggedIn";
      return "undetermined";
    };

    setAuthStatus(getStatus());
  }, [auth0UserLoading, auth0User, isLoading, currentUser]);

  const confirmImpossibleState = (_: never) => {
    throw new Error(`Reaching an impossible state.`);
  };

  const authComponents = () => {
    switch (authStatus) {
      case "undetermined":
        return <div>Loading...</div>;
      case "notLoggedIn":
        return (
          /* eslint-disable */
          <a
            onClick={clickHandler}
            href="/api/auth/login"
            className={`h-fit ${
              auth0UserLoading
                ? "pointer-events-none opacity-70"
                : "pointer-events-auto"
            }`}
          >
            Login / Register
          </a>
        );
      case "loggedInWithAccount":
        return (
          <>
            <Link
              onClick={clickHandler}
              href={`/user/${currentUser?.username}`}
              aria-disabled={!currentUser?.username}
              className={`${
                currentUser?.username
                  ? "pointer-events-auto"
                  : "opacity-50 line-through"
              } h-fit`}
            >
              Account
            </Link>
            <a className="pointer-events-auto" href="/api/auth/logout">
              Logout
            </a>
          </>
        );
      case "loggedInNoAccount":
        return (
          <div>This shouldn't appear, you need to create an account...</div>
        );
      default:
        return confirmImpossibleState(authStatus);
    }
  };

  return (
    <>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button aria-label="User controls" className="rounded-full font-mono">
            <Avatar>
              <AvatarImage
                src={currentUser?.profilePicture?.url}
                className="object-cover"
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent className="font-mono flex flex-col gap-4 m-4">
          {authStatus === "loggedInWithAccount" && (
            <Link
              onClick={clickHandler}
              href={`/user/${currentUser?.username}`}
              aria-disabled={!currentUser?.username}
              className="flex gap-4 items-center border-b pb-4"
            >
              <Avatar className="font-mono">
                <AvatarImage
                  src={currentUser?.profilePicture?.url}
                  className="object-cover"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>

              {currentUser?.username && <span>{currentUser?.username}</span>}
            </Link>
          )}
          {authComponents()}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserMenu;
