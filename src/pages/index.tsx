import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(1);

  const user = useUser();
  const createFrog = api.frogs.create.useMutation();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createFrog.mutate({
      name,
      age,
    });
  };

  const frogs = api.frogs.getAll.useQuery();

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
        {!user.isSignedIn && <SignInButton />}
        {!!user.isSignedIn && <SignOutButton />}

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
