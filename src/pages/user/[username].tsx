import { useUser } from "@auth0/nextjs-auth0/client";
import { Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import { api } from "~/utils/api";

const DeleteUserAlertDialog = dynamic(
  () => import("~/components/User/DeleteUserAlertDialog"),
  {
    loading: () => (
      <Button disabled>
        Delete <Trash2 className="h-4 ml-1" />
      </Button>
    ),
    ssr: false,
  }
);

const EditUserUserFormDialog = dynamic(
  () => import("~/components/User/EditUserFormDialog"),
  {
    loading: () => <Button disabled>Edit Account</Button>,
    ssr: false,
  }
);

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
    <main className="p-4 md:p-8 pt-20 md:pt-24 h-full font-mono w-full max-w-xl">
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

          {isCurrentUserAccount && <CurrentUserControls />}
        </div>
      )}
    </main>
  );
};

export default UserPage;

const CurrentUserControls = () => {
  return (
    <div className="flex gap-2">
      <EditUserUserFormDialog />
      <Button asChild>
        {/* eslint-disable */}
        <a href="/api/auth/logout">Logout</a>
      </Button>
      <DeleteUserAlertDialog />
    </div>
  );
};
