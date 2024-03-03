'use client'

import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from '@trpc/client'


const Provider = (children: ReactNode) => {

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3000/api/trpc"
                })
            ]
        })
    )

    return (
        <trpc.Provider children={
            <QueryClientProvider children={children} client={queryClient} />
        } 
        client={trpcClient} 
        queryClient={queryClient} />
    )
}

export default Provider