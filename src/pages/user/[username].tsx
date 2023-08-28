import { useRouter } from "next/router";
import Image from "~/components/UI/Image";
import { api } from "~/utils/api";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username as string;

  const { data, isLoading } = api.user.getUserByUsername.useQuery(
    {
      username,
    },
    {
      enabled: !!router.query.username,
    }
  );

  return (
    <main className="p-4 h-full w-full flex justify-center items-center font-mono">
      {isLoading && <div>Loading...</div>}
      {data && (
        <div>
          <div className="text-xl font-bold">Name: {data.username}</div>
          <div className="text-muted-foreground">
            Description: {data.description}
          </div>
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
        </div>
      )}
    </main>
  );
};

export default UserPage;
