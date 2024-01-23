'use client'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"


const Navbar = () => {
    return (
        <NavigationMenu  >
            <NavigationMenuList >
                <NavigationMenuItem >
                    <NavigationMenuTrigger className="bg-transparent">Item One</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-transparent">
                        <NavigationMenuLink >Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    )
}

export default Navbar