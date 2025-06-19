import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { getUserById } from "./_actions/profile";
import ProfileClient from "./_components/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/auth/login");
  }

  return <ProfileClient initialUser={user} />;
}
