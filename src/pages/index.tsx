import Head from "next/head";
import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(1);

  const createFrog = api.frogs.create.useMutation();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createFrog.mutate({
      name,
      age,
    });
  };

  const frogs = api.frogs.getAll.useQuery();

  const helloMessage = api.frogs.hello.useQuery({ text: "charlie" });

  const { user, error, isLoading } = useUser();

  return (
    <>
      <Head>
        <title>Sad Frogs</title>
        <meta
          name="description"
          content="A place where Sad Frogs find places to study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: `1rem` }}>
        {/* {!user.isSignedIn && <SignInButton />}
        {!!user.isSignedIn && <SignOutButton />} */}

        {!user && !isLoading && <Link href="/api/auth/login">Login</Link>}
        {!!user && <Link href="/api/auth/logout">Logout</Link>}

        <br />
        <br />

        <form onSubmit={submitHandler}>
          <div>
            <label>
              Name:{" "}
              <input
                name="frogName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </label>
          </div>
          <div>
            <label>
              Age:{" "}
              <input
                name="frogAge"
                value={age}
                onChange={(e) => setAge(+e.target.value)}
                type="number"
              />
            </label>
          </div>
          <input type="submit" />
        </form>

        <br />
        <div>
          <h2>helloMessage</h2>
          {helloMessage.data?.greeting}
        </div>
        <hr />
        <div>
          <h2>frogs</h2>
          {frogs.data?.map((frog) => (
            <div key={frog.id}>
              <div>age: {frog.age}</div>
              <div>name: {frog.name}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
