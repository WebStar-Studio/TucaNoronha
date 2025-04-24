import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Map,
  Bed,
  Package,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, signOut } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
    closeMenu();
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span
                className={`font-playfair font-semibold text-2xl tracking-wide ${scrolled ? "text-primary" : "text-white"}`}
              >
                Tuca
              </span>
              <span
                className={`font-playfair font-semibold text-2xl tracking-wide ${scrolled ? "text-foreground" : "text-white"}`}
              >
                Noronha
              </span>
            </Link>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"} transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/experiences"
                className={`px-3 py-2 text-sm font-medium ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"} transition-colors`}
              >
                Experiences
              </Link>
              <Link
                href="/accommodations"
                className={`px-3 py-2 text-sm font-medium ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"} transition-colors`}
              >
                Accommodations
              </Link>
              <Link
                href="/packages"
                className={`px-3 py-2 text-sm font-medium ${scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"} transition-colors`}
              >
                Packages
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.profile_picture || ""}
                          alt={user?.first_name}
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {user?.first_name?.charAt(0) ||
                            user?.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => setLocation("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={`${scrolled ? "text-primary" : "text-white"}`}
                  onClick={() => setLocation("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  variant={scrolled ? "default" : "outline"}
                  className={
                    scrolled
                      ? "btn-gradient"
                      : "border-white text-gray-800 bg-white/80 hover:bg-white hover:text-gray-900"
                  }
                  onClick={() => setLocation("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className={`p-2 rounded-md ${scrolled ? "text-foreground hover:text-primary" : "text-white"} focus:outline-none`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Home
              </div>
            </Link>
            <Link
              href="/experiences"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Experiences
              </div>
            </Link>
            <Link
              href="/accommodations"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2" />
                Accommodations
              </div>
            </Link>
            <Link
              href="/packages"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Packages
              </div>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-5 space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile_picture || ""}
                        alt={user?.first_name}
                      />
                      <AvatarFallback className="bg-primary text-white">
                        {user?.first_name?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </div>
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                  <button
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col px-5 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setLocation("/signin");
                    closeMenu();
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full btn-gradient"
                  onClick={() => {
                    setLocation("/signup");
                    closeMenu();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
