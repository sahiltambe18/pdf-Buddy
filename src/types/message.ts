import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";
import { number } from "zod";



type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = {
    id: string;
    text: string;
    isUserMsg: boolean;
    createdAt: string;
}[]

type omitText = Omit<Messages[number],"text">


type extendedText = {
    text: string | JSX.Element
}

export type ExtendedMessages = (omitText & extendedText)[];
