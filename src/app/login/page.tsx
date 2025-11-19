import LoginForm from "@/components/login-form";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Redirect to home if already logged in
  const user = await getSession();
  if (user) {
    redirect('/');
  }

  return <LoginForm />;
}
