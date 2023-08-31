import { useUser } from "@auth0/nextjs-auth0/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import { api } from "~/utils/api";

const EditUserUserFormDialog = dynamic(
  () => import("~/components/User/EditUserFormDialog"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => <Button disabled>Edit Account</Button>;

const UserPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const usernameFromParams = Array.isArray(username) ? "" : username || "";

  const { data, isLoading } = api.user.getUserByUsername.useQuery(
    {
      username: usernameFromParams,
    },
    {
      enabled: !!usernameFromParams,
    }
  );

  const { user } = useUser();
  const { data: loggedInUser } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!user,
  });
  const isCurrentUserAccount = loggedInUser?.username === usernameFromParams;

  return (
    <main className="p-4 pt-20 md:pt-24 h-full font-mono w-full max-w-xl">
      {isLoading && <div>Loading...</div>}
      {data && (
        <div className="space-y-4">
          {data.profilePicture && (
            <div className="aspect-square overflow-hidden object-cover border mt-4 w-full h-full rounded-lg">
              <Image
                alt={`Profile picture of ${data.username}`}
                image={data.profilePicture}
                className="w-full h-full object-cover"
                objectFit="cover"
              />
            </div>
          )}

          <div>
            <div className="text-xl font-bold">Name: {data.username}</div>
            <div className="text-muted-foreground">
              Description: {data.description}
            </div>
          </div>

          {isCurrentUserAccount && (
            <div className="flex gap-2">
              <EditUserUserFormDialog />
              <Button asChild>
                {/* eslint-disable */}
                <a href="/api/auth/logout">Logout</a>
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default UserPage;
