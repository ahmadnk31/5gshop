"use client";

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
  Battery,
  Cable,
  Camera,
  ChevronDown,
  Gamepad2,
  Headphones,
  Laptop,
  Menu,
  Monitor,
  Package,
  Search,
  Shield,
  Smartphone,
  Speaker,
  Tablet,
  Watch,
  Wrench,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { UserCircle } from "lucide-react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { useState } from "react";
import { SearchComponent } from "./search-component";
import { ShoppingCart } from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { useCart } from "@/components/cart-context";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchbarOpen, setSearchbarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('navigation');
  const { data: session } = useSession();
  const { items } = useCart();
  const totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { setIsMounted(true); }, []);

  // Device types for repairs dropdown
  const deviceTypes = [
    { type: 'SMARTPHONE', label: t('devices.smartphones'), icon: Smartphone },
    { type: 'TABLET', label: t('devices.tablets'), icon: Tablet },
    { type: 'LAPTOP', label: t('devices.laptops'), icon: Laptop },
    { type: 'SMARTWATCH', label: t('devices.smartwatches'), icon: Watch },
    { type: 'DESKTOP', label: t('devices.desktops'), icon: Monitor },
    { type: 'GAMING_CONSOLE', label: t('devices.gamingConsoles'), icon: Gamepad2 },
    { type: 'OTHER', label: t('devices.otherDevices'), icon: Package },
  ];

  // Accessory categories for accessories dropdown
  const accessoryCategories = [
    { category: 'CASE', label: t('accessoryCategories.casesCovers'), icon: Shield },
    { category: 'CHARGER', label: t('accessoryCategories.chargersPower'), icon: Battery },
    { category: 'CABLE', label: t('accessoryCategories.cablesAdapters'), icon: Cable },
    { category: 'HEADPHONES', label: t('accessoryCategories.audioHeadphones'), icon: Headphones },
    { category: 'SCREEN_PROTECTOR', label: t('accessoryCategories.screenProtection'), icon: Shield },
    { category: 'SPEAKER', label: t('accessoryCategories.speakers'), icon: Speaker },
    { category: 'CAMERA', label: t('accessoryCategories.cameraPhoto'), icon: Camera },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Responsive sizing */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="5gphones Logo"
              width={62}
              height={62}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search Component */}
            <div className="flex-1 max-w-lg mx-4">
              <SearchComponent />
            </div>
            <div className="flex items-center space-x-6">
              {/* Repairs Dropdown */}
              <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Wrench className="h-4 w-4" />
                <span>{t('repairs')}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{t('deviceTypes')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {deviceTypes.map((device) => (
                  <DropdownMenuItem key={device.type} asChild>
                    <Link href={`/repairs?type=${device.type.toLowerCase()}`} className="flex items-center space-x-2">
                      <device.icon className="h-4 w-4" />
                      <span>{device.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/repairs" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>{t('allRepairs')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                <Package className="h-4 w-4" />
                <span>{t('accessories')}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{t('categories')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accessoryCategories.map((accessory) => (
                  <DropdownMenuItem key={accessory.category} asChild>
                    <Link href={`/accessories?category=${accessory.category}`} className="flex items-center space-x-2">
                      <accessory.icon className="h-4 w-4" />
                      <span>{accessory.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/accessories" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>{t('allAccessories')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon - Desktop */}
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {isMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center border border-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

            {/* User info or auth links */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                  {session?.user && (
                    <Avatar>
                      <AvatarImage src={session.user.image ?? undefined} alt="avatar" />
                      <AvatarFallback className="rounded-full w-8 h-8" >
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) }
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {session.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">{t('adminDashboard')}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="bg-destructive text-white" onClick={() => signOut({ callbackUrl: "/" })}>
                    {t('logout')}
                  </DropdownMenuItem>
                
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <UserCircle className="h-4 w-4" />
                    <span>{t('account')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login">{t('login')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register">{t('register')}</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
               
              </div>
            )}
          </div>
          <Button asChild>
              <Link href="/quote">{t('getQuote')}</Link>
            </Button>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-6">
            {/* Tablet Search Icon */}
            <button
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Open search"
              onClick={() => setSearchbarOpen(!searchbarOpen)}
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Tablet Search Bar - Toggleable */}
            {searchbarOpen && (
              <div className="absolute left-0 right-0 top-16 z-50 bg-white border-b border-gray-200 shadow-md px-4 py-3">
                <SearchComponent />
              </div>
            )}
            {/* Compact tablet menu with essential items */}
            
            {/* Repairs Dropdown - Compact */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors text-sm">
                <Wrench className="h-4 w-4" />
                <span>{t('repairs')}</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs">{t('deviceTypes')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {deviceTypes.slice(0, 4).map((device) => (
                  <DropdownMenuItem key={device.type} asChild>
                    <Link href={`/repairs?type=${device.type.toLowerCase()}`} className="flex items-center space-x-2 text-sm">
                      <device.icon className="h-3 w-3" />
                      <span>{device.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/repairs" className="flex items-center space-x-2 text-sm">
                    <Package className="h-3 w-3" />
                    <span>{t('allRepairs')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessories Dropdown - Compact */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors text-sm">
                <Package className="h-4 w-4" />
                <span>{t('accessories')}</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs">{t('categories')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accessoryCategories.slice(0, 4).map((accessory) => (
                  <DropdownMenuItem key={accessory.category} asChild>
                    <Link href={`/accessories?category=${accessory.category}`} className="flex items-center space-x-2 text-sm">
                      <accessory.icon className="h-3 w-3" />
                      <span>{accessory.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/accessories" className="flex items-center space-x-2 text-sm">
                    <Package className="h-3 w-3" />
                    <span>{t('allAccessories')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

             {/* User info or auth links */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                  {session?.user && (
                    <Avatar>
                      <AvatarImage src={session.user.image ?? undefined} alt="avatar" />
                      <AvatarFallback className="rounded-full w-8 h-8" >
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) }
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <UserCircle className="h-4 w-4" />
                    <span>{t('account')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login">{t('login')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register">{t('register')}</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
               
              </div>
            )}
            {/* Cart Icon - Desktop & Tablet */}
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {isMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center border border-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
          </div>

          {/* Mobile/Small Screen Navigation */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Cart Icon - Mobile */}
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {isMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center border border-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

            {/* Search Icon */}
            <button
              onClick={() => setSearchbarOpen(!searchbarOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User Avatar/Account */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center focus:outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image ?? undefined} alt="avatar" />
                    <AvatarFallback className="rounded-full w-8 h-8 text-xs">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-sm">{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-sm">
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="text-sm">{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {session.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-sm">{t('adminDashboard')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem 
                    className="bg-destructive text-white text-sm" 
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <UserCircle className="h-6 w-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="text-sm">{t('login')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="text-sm">{t('register')}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Toggleable */}
        {searchbarOpen && (
          <div className="md:hidden py-3 border-t bg-gray-50">
            <div className="px-2">
              <SearchComponent />
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t overflow-y-auto max-h-[calc(100vh-64px)]">            
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('home')}
              </Link>
              
              {/* Mobile Repairs Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-900 font-medium">
                  <Wrench className="h-4 w-4" />
                  <span>{t('repairs')}</span>
                </div>
                <div className="pl-6 space-y-2">
                  {deviceTypes.map((device) => (
                    <Link 
                      key={device.type}
                      href={`/repairs?type=${device.type.toLowerCase()}`} 
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <device.icon className="h-4 w-4" />
                      <span>{device.label}</span>
                    </Link>
                  ))}
                  <Link 
                    href="/repairs" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>{t('allRepairs')}</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Accessories Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-900 font-medium">
                  <Package className="h-4 w-4" />
                  <span>{t('accessories')}</span>
                </div>
                <div className="pl-6 space-y-2">
                  {accessoryCategories.map((accessory) => (
                    <Link 
                      key={accessory.category}
                      href={`/accessories?category=${accessory.category}`} 
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <accessory.icon className="h-4 w-4" />
                      <span>{accessory.label}</span>
                    </Link>
                  ))}
                  <Link 
                    href="/accessories" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>{t('allAccessories')}</span>
                  </Link>
                </div>
              </div>

              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('contact')}
              </Link>
              <Button asChild className="w-fit" onClick={() => setIsOpen(false)}>
                <Link href="/quote">{t('getQuote')}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}