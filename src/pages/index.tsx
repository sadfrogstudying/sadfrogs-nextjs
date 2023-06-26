import Head from "next/head";
import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const [name, setName] = useState("");
  const [hasWifi, setHasWifi] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const studySpots = api.studySpots.getAll.useQuery();
  const { mutate, error } = api.studySpots.createOne.useMutation();
  const nameError = error?.data?.zodError?.fieldErrors.name;
  const errorMessage = error?.message;

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      name,
      hasWifi,
      location: {
        lat,
        lng,
      },
    });
  };

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
        <form onSubmit={submitHandler}>
          <div>
            <label>
              Name:{" "}
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={hasWifi}
                onChange={() => setHasWifi((x) => !x)}
              />
            </label>
            hasWifi
          </div>

          <div>
            <label>
              lat:{" "}
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
              />
            </label>
          </div>

          <div>
            <label>
              lng:{" "}
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
              />
            </label>
          </div>
          <input type="submit" />
        </form>

        {nameError && <div>{nameError}</div>}
        {errorMessage && <div>{errorMessage}</div>}

        <br />
        <hr />
        <div>
          <h2>Study Spots</h2>
          {studySpots.data?.map((studySpot) => (
            <div key={studySpot.id}>
              <div>has wifi: {studySpot.hasWifi}</div>
              <div>name: {studySpot.name}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
