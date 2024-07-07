"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import MaxWidthWraapper from "./MaxWidthWraapper";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { signIn  , signOut, useSession} from 'next-auth/react'

export default function NavigationMenuDemo() {

  const handleLogout = ()=>{
    signOut({callbackUrl:"/" , redirect:true})
  }
  
  const handleSignIn = ()=>{
    signIn()
  }

  const {data:session , status} = useSession()
  const isLoading = status==="loading"
  return (
    <MaxWidthWraapper className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList className=" sm:w-[50rem] flex justify-between px-5 font-semibold">
          <NavigationMenuItem>
            <Link href={"/"} >
            <Image
              src={"/jarvis.png"}
              alt="logo"
              width={150}
              height={60}
              quality={100}
              />
            </Link>
          </NavigationMenuItem>
          <div className="flex w-80 text-xs justify-between">
            {!isLoading && !session && <NavigationMenuItem className={buttonVariants({variant:"underline" })} onClick={handleSignIn} >Sign-in</NavigationMenuItem>}
            <NavigationMenuItem  className={buttonVariants({variant:"underline" })} >
              <Link href={"/dashboard/"} className="flex gap-2" >
              Get Started <ArrowRight className="hover:animate-pulse hover:duration-1000" /> 
              </Link>
              </NavigationMenuItem>
            {!isLoading && session && (<NavigationMenuItem className={buttonVariants({variant:"underline" })} onClick={handleLogout} >Logout</NavigationMenuItem>)}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </MaxWidthWraapper> 
  );
}
