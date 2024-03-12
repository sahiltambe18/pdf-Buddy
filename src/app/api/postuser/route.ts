import { randomUUID } from "crypto";
import prisma from "../../../../prisma";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

const postUser = async (req: Request, res: NextApiResponse) => {
  try {

    const data = await req.json()
    console.log(data);
      // Now you can access data.email and perform user creation logic here

      // Respond with the email extracted from the request body
      return NextResponse.json({email:data.email});
  } catch (error) {
    console.error('Failed to create user:', error);
  }
};

export { postUser as POST};
