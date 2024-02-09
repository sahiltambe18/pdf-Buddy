"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import MaxWidthWraapper from "./MaxWidthWraapper";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function NavigationMenuDemo() {
  return (
    <MaxWidthWraapper className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList className=" w-[40rem] flex justify-between px-5  font-semibold">
          <NavigationMenuItem>
            <Image
              src={"/jarvis.png"}
              alt="logo"
              width={150}
              height={60}
              quality={100}
            />
          </NavigationMenuItem>
          <div className="flex w-64 justify-between">
            <NavigationMenuItem className={buttonVariants({variant:"underline" })} >Pricing</NavigationMenuItem>
            <NavigationMenuItem className={buttonVariants({variant:"underline" })} >Sign-in</NavigationMenuItem>
            <NavigationMenuItem className={buttonVariants({variant:"underline" })} >Get Started <ArrowRight className="hover:animate-bounce" /> </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </MaxWidthWraapper> 
  );
}
