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
  ChevronDown,
  Edit,
  Gamepad2,
  Headphones,
  Laptop,
  Menu,
  Monitor,
  Package,
  Search,
  Shield,
  Smartphone,
  Tablet,
  Watch,
  Wrench,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { WishlistSheet } from "@/components/wishlist-sheet";
import { useCart } from "@/components/cart-context";
import { MultiStepDeviceNav } from './MultiStepDeviceNav'
import { DeviceTypeNavbar } from "./device-type-navbar";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [searchbarOpen, setSearchbarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('navigation');
  
  const { data: session, status } = useSession();

  // Debug logging - KEEP THIS FOR NOW
  useEffect(() => {
    console.log('=== Navigation Session Debug ===');
    console.log('Session status:', status);
    console.log('Session data:', JSON.stringify(session, null, 2));
    console.log('User data:', session?.user);
    console.log('===============================');
  }, [session, status]);

  const { items } = useCart();
  const totalCartItems = Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  
  // Prevent hydration mismatch by only showing session-dependent UI after mount
  const isSessionLoading = status === "loading" || !isMounted;

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      
      // Call logout API for server-side cleanup
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (apiError) {
        console.warn('Logout API call failed:', apiError);
        // Continue with client-side logout even if API fails
      }
      
      // Perform client-side logout
      await signOut({ 
        redirect: false  // Don't use NextAuth's redirect
      });
      
      // Force a hard redirect to ensure session is fully cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force redirect to home page
      window.location.href = '/';
    }
  };

  useEffect(() => { setIsMounted(true); }, []);

  // Device types for repairs dropdown
  const deviceTypes = [
    { type: 'smartphone', label: t('devices.smartphones'), icon: Smartphone },
    { type: 'tablet', label: t('devices.tablets'), icon: Tablet },
    { type: 'laptop', label: t('devices.laptops'), icon: Laptop },
    { type: 'smartwatch', label: t('devices.smartwatches'), icon: Watch },
    { type: 'desktop', label: t('devices.desktops'), icon: Monitor },
    { type: 'gaming-console', label: t('devices.gamingConsoles'), icon: Gamepad2 },
  ];

  // Accessory categories for accessories dropdown - matching the accessories page
  const accessoryCategories = [
    { category: 'CASE', label: t('accessoryCategories.casesCovers'), icon: Shield },
    { category: 'CHARGER', label: t('accessoryCategories.chargersPower'), icon: Battery },
    { category: 'CABLE', label: t('accessoryCategories.cablesAdapters'), icon: Cable },
    { category: 'HEADPHONES', label: t('accessoryCategories.audioHeadphones'), icon: Headphones },
    { category: 'SCREEN_PROTECTOR', label: t('accessoryCategories.screenProtection'), icon: Shield },
    { category: 'KEYBOARD', label: t('accessoryCategories.keyboards'), icon: Monitor },
    { category: 'MOUSE', label: t('accessoryCategories.miceTrackpads'), icon: Monitor },
    { category: 'STYLUS', label: t('accessoryCategories.stylusPens'), icon: Edit },
    { category: 'STAND', label: t('accessoryCategories.standsHolders'), icon: Monitor },
    { category: 'MOUNT', label: t('accessoryCategories.mountsBrackets'), icon: Monitor },
    { category: 'OTHER', label: t('accessoryCategories.otherAccessories'), icon: Package },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
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
          <div className="hidden lg:flex items-center space-x-8 mx-4">
            {/* Search Component */}
            <div className="flex-1 mx-6">
              <SearchComponent />
            </div>
            <div className="flex items-center space-x-8">
              {/* Repairs Dropdown */}
              <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700  transition-colors">
                <Wrench className="h-4 w-4" />
                <span>{t('repairs')}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{t('deviceTypes')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {deviceTypes.map((device) => (
                  <DropdownMenuItem key={device.type} asChild>
                    <Link href={`/repairs/${device.type}`} title={device.label} className="flex items-center space-x-2">
                      <device.icon className="h-4 w-4" />
                      <span>{device.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/repairs" title={t('allRepairs')} className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>{t('allRepairs')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700  transition-colors">
                <Package className="h-4 w-4" />
                <span>{t('accessories')}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{t('categories')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accessoryCategories.map((accessory) => (
                  <DropdownMenuItem key={accessory.category} asChild>
                    <Link href={`/accessories?category=${accessory.category}`} title={accessory.label} className="flex items-center space-x-2">
                      <accessory.icon className="h-4 w-4" />
                      <span>{accessory.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/accessories" title={t('allAccessories')} className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>{t('allAccessories')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon - Desktop */}
            <WishlistSheet />
            <button
              className="relative p-2 rounded-full transition-colors"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {isMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full bg-red-700 px-1.5 py-0.5 min-w-[1.25rem] text-center border border-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

            {/* User info or auth links - DESKTOP */}
            {!isSessionLoading && status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name || "User avatar"} />
                    <AvatarFallback className="rounded-full w-8 h-8 bg-green-100 text-green-700 font-semibold">
                      {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile" title={t('profile')}>
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" title={t('myOrders')}>{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" title={t('wishlist')}>{t('wishlist')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings" title={t('settings')}>{t('settings')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {session.user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" title={t('adminDashboard')}>{t('adminDashboard')}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="bg-destructive text-white" onClick={handleLogout}>
                    {t('logout')}
                  </DropdownMenuItem>
                
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isSessionLoading ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700  transition-colors">
                    <UserCircle className="h-4 w-4" />
                    <span>{t('account')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" title={t('login')}>{t('login')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" title={t('register')}>{t('register')}</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
               
              </div>
            ) : null}
          </div>
          <Button asChild className="">
              <Link href="/quote" title={t('getQuote')}>{t('getQuote')}</Link>
            </Button>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-8 mx-4">
            {/* Tablet Search Icon */}
            <button
              className="p-2 text-gray-700 transition-colors"
              aria-label="Open search"
              onClick={() => setSearchbarOpen(!searchbarOpen)}
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Tablet Search Bar - Toggleable */}
            {searchbarOpen && (
              <div className="absolute left-0 right-0 top-16 z-[10000] bg-white border-b border-gray-200 shadow-md px-4 py-3">
                <SearchComponent onClose={() => setSearchbarOpen(false)} />
              </div>
            )}
            {/* Compact tablet menu with essential items */}
            
            {/* Repairs Dropdown - Compact */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-green-700 transition-colors text-sm">
                <Wrench className="h-4 w-4" />
                <span>{t('repairs')}</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs">{t('deviceTypes')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {deviceTypes.slice(0, 4).map((device) => (
                  <DropdownMenuItem key={device.type} asChild>
                    <Link href={`/repairs/${device.type}`} title={`${device.label} repair services in Leuven`} className="flex items-center space-x-2 text-sm">
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
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors text-sm">
                <Package className="h-4 w-4" />
                <span>{t('accessories')}</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs">{t('categories')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accessoryCategories.map((accessory) => (
                  <DropdownMenuItem key={accessory.category} asChild>
                    <Link href={`/accessories?category=${accessory.category}`} title={`Shop ${accessory.label} accessories`} className="flex items-center space-x-2 text-sm">
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

             {/* User info or auth links - TABLET */}
            {!isSessionLoading && status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name || "User avatar"} />
                    <AvatarFallback className="rounded-full w-8 h-8 bg-green-100 text-green-700 font-semibold">
                      {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">{t('wishlist')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">{t('settings')}</Link>
                  </DropdownMenuItem>
                  {/* if user is admin, show admin dashboard */}
                  {session.user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">{t('adminDashboard')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="bg-destructive text-white" onClick={handleLogout}>
                    {t('logout')}
                  </DropdownMenuItem>
                 
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isSessionLoading ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors">
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
            ) : null}
            {/* Cart Icon - Desktop & Tablet */}
            <WishlistSheet />
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {isMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center border border-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
          </div>

          {/* Mobile/Small Screen Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Icon - Mobile */}
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {isMounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center border border-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

            {/* Search Icon */}
            <button
              onClick={() => setSearchbarOpen(!searchbarOpen)}
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User Avatar/Account - MOBILE */}
            {!isSessionLoading && status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center focus:outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name || "User avatar"} />
                    <AvatarFallback className="rounded-full w-8 h-8 bg-green-100 text-green-700 text-xs font-semibold">
                      {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-sm">{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile" className="text-sm">
                      {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="text-sm">{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">{t('wishlist')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings" className="text-sm">{t('settings')}</Link>
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
                    onClick={handleLogout}
                  >
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isSessionLoading ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center p-2 text-gray-700 hover:text-green-600 transition-colors">
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
            ) : null}

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

        {/* Mobile Search Overlay - Toggleable */}
        {searchbarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setSearchbarOpen(false)}
            />
            {/* Search Overlay */}
            <div className="md:hidden fixed left-0 right-0 top-0 z-[9999] bg-white shadow-xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{t('search')}</h3>
                  <button
                    onClick={() => setSearchbarOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SearchComponent onClose={() => setSearchbarOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t overflow-y-auto max-h-[calc(100vh-64px)] relative z-40">{' '}            
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
               
                className="text-gray-700 hover:text-green-600 transition-colors"
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
                      href={`/repairs/${device.type}`}
                      title={`${device.label} repair services in Leuven`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <device.icon className="h-4 w-4" />
                      <span>{device.label}</span>
                    </Link>
                  ))}
                  <Link 
                    href="/repairs"
                   
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
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
                      title={`Shop ${accessory.label} accessories`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <accessory.icon className="h-4 w-4" />
                      <span>{accessory.label}</span>
                    </Link>
                  ))}
                  <Link 
                    href="/accessories"
                   
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>{t('allAccessories')}</span>
                  </Link>
                </div>
              </div>

              <Link 
                href="/about"
               
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href="/contact"
               
                className="text-gray-700 hover:text-green-600 transition-colors"
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
      <DeviceTypeNavbar />
    </nav>
  );
}