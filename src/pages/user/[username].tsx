// import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { Button } from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import { api } from "~/utils/api";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username as string;
  // const { user, error, isLoading: currUserLoading } = useUser();

  const { data, isLoading } = api.user.getUserByUsername.useQuery(
    {
      username,
    },
    {
      enabled: !!router.query.username,
    }
  );

  return (
    <main className="p-4 pt-20 md:pt-24 h-full font-mono w-full max-w-xl">
      {isLoading && <div>Loading...</div>}
      {data && (
        <div className="space-y-4">
          {data.profilePicture && (
            <div className="aspect-square overflow-hidden object-cover border mt-4 w-full h-full">
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
          <Button asChild>
            {/* eslint-disable */}
            <a href="/api/auth/logout" className="mt-4">
              Logout
            </a>
          </Button>
        </div>
      )}
    </main>
  );
};

export default UserPage;
