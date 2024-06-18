'use client'

import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from '@trpc/client'


const Provider = ({ children }: { children: ReactNode }) => {

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "https://pdf-buddy-lr7w-7ggqgh51s-sahiltambe18s-projects.vercel.app/"
                })
            ]
        })
    )

    return (
        <trpc.Provider
            client={trpcClient}
            queryClient={queryClient} >
            <QueryClientProvider client={queryClient} >
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Provider