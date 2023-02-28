import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";

import { api } from "~/utils/api";

Pusher.logToConsole = true;

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

const Home: NextPage = () => {
  const session = useSession();
  const trpcContext = api.useContext();
  const getRoom = api.room.getRoom.useQuery();
  const createRoom = api.room.createRoom.useMutation({
    onSuccess: () => {
      void trpcContext.room.getRoom.invalidate();
    },
  });

  return (
    <main className="min-h-screen bg-slate-200">
      <header className="p-4">
        <span>Scrum Poker</span>
        {session.status === "authenticated" ? (
          <button
            className="btn-primary btn"
            type="button"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </button>
        ) : (
          <button
            className="btn-primary btn"
            type="button"
            onClick={() => {
              void signIn();
            }}
          >
            Log in
          </button>
        )}
      </header>
      <section>
        <button
          className="btn-primary btn"
          disabled={createRoom.isLoading}
          onClick={() => {
            createRoom.mutate();
          }}
        >
          Create Room
        </button>
      </section>
      {getRoom.data && <div>Room: {getRoom.data.roomId}</div>}
      <input></input>
    </main>
  );
};

export default Home;
