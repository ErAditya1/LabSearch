import DashboardLayout from "@/components/layout/DashboardLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Layout({ children }: { children: React.ReactNode }) {


  
  // load current session if no session then redirect to login
  const session = await getServerSession();
  console.log(session);
  if (!session) {
    redirect("/auth/login");
  }


  return <DashboardLayout>{children}</DashboardLayout>;
}
