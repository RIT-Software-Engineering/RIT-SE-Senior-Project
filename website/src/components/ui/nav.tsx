import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { ThemeToggler } from "./theme-toggler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { SecureFetch } from "@/lib/secure-fetch";
import { config } from "../../lib/constants";

function Nav() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      SecureFetch(config.url.DEV_ONLY_API_GET_ALL_USERS)
        .then((response) => response.json())
        .then((users) => {
          setUsers(users);
        });
    }
  }, []);

  return (
    <div className="m-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/projects">Projects</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <NavigationMenuLink>Dev Login/Out</NavigationMenuLink>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Dev Login/Out</DialogTitle>
                  <DialogDescription>
                    Sign in as any Admin, Coach, or Student!
                  </DialogDescription>
                </DialogHeader>
                <div className="inline-flex">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="username" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user, idx) => (
                        <SelectItem
                          value={`${idx}`}
                        >{`${user.fname} ${user.lname} (${user.system_id})`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="destructive">Reset Database</Button>
                  <Button variant="secondary">Logout</Button>
                  <Button variant="default">Login</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </NavigationMenuItem>
        </NavigationMenuList>
        <ThemeToggler />
      </NavigationMenu>
    </div>
  );
}

export default Nav;
