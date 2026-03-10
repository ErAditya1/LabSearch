"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

type Role = "admin" | "analyst" | "viewer";

type UserContextType = {
    id: string | null;
    email: string | null;
    name: string | null;
    image: string | null;
    role: Role | null;
    isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
    id: null,
    email: null,
    name: null,
    image: null,
    role: null,
    isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    console.log(session)

    const [user, setUser] = useState<UserContextType>({
        id: null,
        email: null,
        name: null,
        image: null,
        role: null,
        isLoading: true,
    });

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            // Only redirect to login if accessing protected routes
            if (pathname?.startsWith("/dashboard")) {
                router.push("/auth/login");
            }

            setUser({
                id: null,
                email: null,
                name: null,
                image: null,
                role: null,
                isLoading: false,
            });

            return;
        }

        setUser({
            id: (session.user as any)?.id ?? null,
            email: session.user?.email ?? null,
            name: session.user?.name ?? null,
            image: session.user?.image ?? null,
            role: (session.user as any)?.role ?? null,
            isLoading: false,
        });
    }, [session, status, router, pathname]);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);