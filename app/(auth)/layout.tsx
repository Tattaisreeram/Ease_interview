import { ReactNode } from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

    if (isUserAuthenticated) redirect("/");

  return (
    <div className="flex items-center justify-center mx-auto max-w-7xl min-h-screen bg-black text-white px-4 py-8">
      {children}
    </div>
  );
};


export default AuthLayout;
