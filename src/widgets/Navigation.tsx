import retrieveLinks from "@/app/actions/links";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default async function Navigation() {
  const navigationLinks = await retrieveLinks();

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {Object.entries(navigationLinks).map((link, index) => {
            return (
              <NavigationMenuItem key={index}>
                <Link href={link[1]}>
                  <span className={navigationMenuTriggerStyle()}>
                    {link[0]}
                  </span>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
