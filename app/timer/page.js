'use client'
import ReactTimer from "../../pageComponents/circleTimer.js";
import { useClient } from 'next/client';
import { useSession } from 'next-auth/react';

export default function TimerPage() {
    const { data: session } = useSession();
    const isUserSignedIn = session?.user;
    return (
        <>
            {isUserSignedIn && (
                <ReactTimer />
            )}
        </>
    );
}

