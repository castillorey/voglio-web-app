import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import supabase from "../supabase-client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const [data, setData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem("session");
        if (session) {
            const user = session && JSON.parse(session)?.user;
            setData(user);
        }
    }, []);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate("/login");
    };
    return (
        <>   {data ?
            <div>
                <div className="flex items-start gap-3">
                    <Avatar className="size-9">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold tracking-tight leading-none">
                            {data.email.split("@")[0]}
                        </span>
                        <span className="leading-none text-sm text-muted-foreground">
                            {data.email}
                        </span>
                    </div>
                </div>
                <p className="mt-4 h-2 w-full border-b border-gray-300"></p>
            </div>
            : null}
            <Button className="mt-2" variant="destructive" onClick={signOut}>Log out</Button>
        </>
    );
}