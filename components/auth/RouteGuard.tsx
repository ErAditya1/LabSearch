"use client";

import { useUser } from "@/contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
    children: React.ReactNode;
    allowedRoles: ("admin" | "analyst" | "viewer")[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
    const { role, isLoading, id } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!id) {
                // Only redirect to login if accessing protected routes
                if (pathname?.startsWith("/dashboard")) {
                    router.push("/auth/login");
                }
            } else if (role && !allowedRoles.includes(role)) {
                // Redirect unauthorized users to the main dashboard
                router.push("/dashboard");
            }
        }
    }, [role, isLoading, id, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    // If user is loaded and has an allowed role, render the content
    if (role && allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    // Fallback while redirecting
    return null;
}
