import { useUser } from "@auth0/nextjs-auth0/client";
import type { Frog } from "@prisma/client";
import Link from "next/link";
import { useEffect } from "react";

const RegularFetchPage = () => {
  const { user, error, isLoading } = useUser();

  const fetcher = async () => {
    const res = await fetch("http://localhost:3000/api/frogs.getall", {
      method: "GET",
    });

    if (!res) {
      return [];
    }

    const data = (await res.json()) as Frog[];
    return data;
  };

  useEffect(() => {
    fetcher()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <main style={{ padding: `1rem` }}>
      {!user && !isLoading && <Link href="/api/auth/login">Login</Link>}
      {!!user && <Link href="/api/auth/logout">Logout</Link>}
    </main>
  );
};

export default RegularFetchPage;

// export const getStaticProps = async () => {
//   const res = await fetch("http://localhost:3000/api/frogs.getall", {
//     method: "GET",
//   });

//   if (!res) {
//     return { props: { data: [] } };
//   }

//   // const data = (await res.json()) as Frog[];

//   return { props: { data: [] } };
// };
