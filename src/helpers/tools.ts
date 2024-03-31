import prisma from "../../prisma";

const getUser = async(email:string)=>{
    const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    return user;
}

export{
    getUser
}