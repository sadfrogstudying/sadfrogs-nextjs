import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import CreateUserForm from "~/components/User/CreateUserForm";
import { api } from "~/utils/api";

const PrivatePage = () => {
  const { user, error, isLoading } = useUser();

  const { data: currentUser, isLoading: currentUserLoading } =
    api.user.getCurrentUser.useQuery(
      { email: user?.email || "" },
      {
        retry: 0,
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
            {currentUser.image && (
              <Image
                alt={`Profile picture of ${currentUser.username}`}
                image={currentUser.image}
                className="aspect-square overflow-hidden rounded-full w-24 h-24 object-cover border"
              />
            )}
          </div>
        )}
        <div>Welcome {user.name}!</div>
        <Button asChild>
          {/* eslint-disable */}
          <a href="/api/auth/logout">Logout</a>
        </Button>
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
