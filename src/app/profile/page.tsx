import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import ProfileClient from "./_components/ProfileClient";
import { connectDB } from "@/lib/connectDb";
import { User } from "@/schema";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user data directly from database instead of Server Action
  try {
    await connectDB();
    const user = await User.findById(session.user.id)
      .select("-password")
      .populate("addresses")
      .lean();

    if (!user) {
      redirect("/auth/login");
    }

    return <ProfileClient initialUser={user as any} />;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    redirect("/auth/login");
  }
}
