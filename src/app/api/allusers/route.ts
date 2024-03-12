import { randomUUID } from "crypto";
import prisma from "../../../../prisma";
import { NextResponse } from "next/server";


  const postUser = async (req:Request) => {
  try {
    
    console.log(req.body)
    //await prisma.$connect();

    // Parse the request body
    
    // const { email } = JSON.parse(req.body); // Assuming it's JSON data

    // console.log('Email:', email); // Log the email extracted from the request body

    // // Create user using extracted email
    // let user = await prisma.user.create({
    //   data: {
    //     id: randomUUID(),
    //     email: email,
    //   },
    // });

    // return NextResponse.json(user);
     return NextResponse.json({email : req.body.email});

  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user');
  }
};

export {postUser as POST};