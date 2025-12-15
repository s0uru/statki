// app/(protected)/user/signout/page.js
'use client';
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        signOut(auth).then(() => {
            // Po wylogowaniu wróć na stronę główną
            router.push('/'); 
        });
    }, [router]);

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-xl font-bold">Wylogowywanie...</h1>
        </div>
    );
}