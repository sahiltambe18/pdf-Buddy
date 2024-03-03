import prisma from "../../prisma";

export const ConnectToDatabase = async ()=>{
    try {
        await prisma.connect()
    } catch (error) {
        throw new Error("failed to connect db")
    }
}