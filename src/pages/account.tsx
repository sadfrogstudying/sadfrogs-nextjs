import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import { api } from "~/utils/api";
import CreateUserForm from "~/components/User/CreateUserForm";

const PrivatePage = () => {
  const { user, error, isLoading } = useUser();

  const { data: currentUser, isLoading: currentUserLoading } =
    api.user.getCurrentUser.useQuery(
      { email: user?.email || "" },
      {
        retry: 0,
        refetchOnWindowFocus: false,
        enabled: !!user,
      }
    );

  if (isLoading) return <Wrapper>Loading...</Wrapper>;
  if (error) return <Wrapper>{error.message}</Wrapper>;

  if (user) {
    return (
      <Wrapper>
        {!currentUser && !currentUserLoading && (
          <div>
            <CreateUserForm />
          </div>
        )}
        {currentUser && (
          <div>
            <div>{currentUser.username}</div>
            <div>{currentUser.email}</div>
            <div>{currentUser.description}</div>
            {currentUser.profilePicture && (
              <div className="aspect-square overflow-hidden rounded-full w-24 h-24 object-cover border mt-4">
                <Image
                  alt={`Profile picture of ${currentUser.username}`}
                  image={currentUser.profilePicture}
                  className="w-full h-full object-cover"
                  objectFit="cover"
                />
              </div>
            )}
            <Button asChild>
              {/* eslint-disable */}
              <a href="/api/auth/logout" className="mt-4">
                Logout
              </a>
            </Button>
          </div>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Button asChild>
        {/* eslint-disable */}
        <a href="/api/auth/login">Login</a>
      </Button>
    </Wrapper>
  );
};

export default PrivatePage;

const Wrapper = ({ ...props }) => (
  <main className="p-4 pt-20 md:pt-24 md:px-8 space-y-4 font-mono">
    {props.children}
  </main>
);
