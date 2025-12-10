import Nav from "@/components/nav";
import { getSession } from "@/app/lib/session";
import { logout } from "@/app/lib/auth";
import CaptainFinder from "@/components/captain-finder";
import FriendsList from "@/components/friends-list";

export default async function ProfilePage() {
  const user = await getSession();

  console.log(user);

  return (
    <div className="bg-background flex flex-col  w-full h-full">
      <header className="py-2">
        <h1 className="text-2xl text-foreground">
          Journal de bord
        </h1>
      </header>
      <main className="generic-bordered-container h-full flex flex-col justify-between">
        {/* Content */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="label-text">Nom du capitaine</p>
            <p className="text-foreground text-lg">{user?.username}</p>
          </div>
          <CaptainFinder />
          <FriendsList />
        </div>
          
        {/* Action buttons */}
        <div>
          <form action={logout}>
            <button
              type="submit"
              className="button-fill responsive-width"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </main>
      <Nav tab="Profile" />
    </div>
  );
}
