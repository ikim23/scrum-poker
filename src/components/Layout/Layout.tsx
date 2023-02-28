import { Button } from "flowbite-react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const session = useSession();

  const callbackUrl =
    (router.query.callbackUrl as string | undefined) ?? "/rooms";

  return (
    <main className="min-h-screen bg-gray-900">
      <header className=" flex items-center border-b-2 border-solid border-gray-700 bg-gray-800 py-6 px-10">
        <span className="mr-auto text-xl">Scrum Poker</span>
        {session.status === "authenticated" ? (
          <div className="flex items-center gap-6">
            <span>{session.data.user?.email}</span>
            <Button
              className="min-w-[180px]"
              onClick={() => {
                void signOut({ callbackUrl: "/" });
              }}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            className="min-w-[180px]"
            onClick={() => {
              void signIn("google", { callbackUrl });
            }}
          >
            Sign in with Google
          </Button>
        )}
      </header>
      <div className="px-10 pt-6 pb-10">{children}</div>
    </main>
  );
}
