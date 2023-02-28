import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher, { Channel } from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";

import { api } from "~/utils/api";

Pusher.logToConsole = true;

const Room: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const session = useSession();
  const trpcContext = api.useContext();
  const channel = useRef<Channel | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    channel.current = pusher.subscribe(roomId);

    channel.current.bind("message", (data) => {
      console.log(data);
    });

    return () => {
      channel.current?.disconnect();
    };
  }, [roomId]);

  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-slate-200">
      <div>User: {session.data?.user?.email}</div>
      <div>Room: {roomId}</div>
      <input
        type="text"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      ></input>
      <button
        type="button"
        onClick={() => {
          channel.current?.trigger("client-message", message);
          setMessage("");
        }}
      >
        Send
      </button>
    </main>
  );
};

export default Room;
