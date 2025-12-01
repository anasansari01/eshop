"use client"
import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import useSidebar from 'apps/seller-ui/src/hooks/useSidebar'
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import Box from '../box';
import { Sidebar } from './sidebar.styles';
import Link from 'next/link';
import Logo from 'apps/seller-ui/src/assets/svgs/Logo';
import SidebarItem from './sidebar.items';
import Home from 'apps/seller-ui/src/assets/icons/home';
import SidebarMenu from './sidebar.menu';
import { BellPlus, BellRing, CalendarPlus, Headset, ListOrdered, LogOut, Mail, PackageSearch, Settings, SquarePlus, TicketPercent } from 'lucide-react';
import Payments from 'apps/seller-ui/src/assets/icons/payment';

const SidebarBarWrapper = () => {
  const {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const {seller} = useSeller();

  useEffect(()=>{
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) => activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
    css={{
      height: "100vh",
      zIndex: 202,
      position: "sticky",
      padding: "8px",
      top: "0",
      overflowY: "scroll",
      scrollbarWidth: "none"
    }}
    className='sidebar-wrapper'
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className='flex justify-center items-center text-center gap-2'>
            <Logo/>
              <Box>
                <h3 className='text-xl font-medium text-[#ecedee]'>
                  {seller?.shop?.name}
                </h3>
                <h5 className='font-medium text-xs pl-2 text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]'>
                {seller?.shop?.address}
                </h5>
              </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className='block my-3 h-full'>
        <Sidebar.Body className='body sidebar'>
          <SidebarItem 
            title='Dashboard'
            href='/dashboard'
            icon={<Home fill={getIconColor("/dashboard")}/>}
            isActive={activeSidebar === "/dashboard"}
            />
          <div className='mt-2 block'>
            <SidebarMenu  title='Main Menu'>
              <SidebarItem 
                title='Orders'
                href='/dashboard/orders'
                icon={<ListOrdered size={26} fill={getIconColor("/dashboard/orders")}/>}
                isActive={activeSidebar === "/dashboard/orders"}
                />
              <SidebarItem 
                title='Payments'
                href='/dashboard/payments'
                icon={<Payments size={26} fill={getIconColor("/dashboard/payments")}/>}
                isActive={activeSidebar === "/dashboard/payments"}
              />
            </SidebarMenu>
            <SidebarMenu title='Products'>
              <SidebarItem 
                title='Create Products'
                href='/dashboard/create-products'
                icon={<SquarePlus size={26} fill={getIconColor("/dashboard/create-payments")}/>}
                isActive={activeSidebar === "/dashboard/create-products"}
              />
              <SidebarItem 
                title='All Products'
                href='/dashboard/all-products'
                icon={<PackageSearch size={22} fill={getIconColor("/dashboard/all-products")}/>}
                isActive={activeSidebar === "/dashboard/all-products"}
              />
            </SidebarMenu>
            <SidebarMenu title='Events'>
              <SidebarItem 
                title='Create events'
                href='/dashboard/create-events'
                icon={<CalendarPlus size={24} fill={getIconColor("/dashboard/create-events")}/>}
                isActive={activeSidebar === "/dashboard/create-events"}
              />
              <SidebarItem 
                title='All Events'
                href='/dashboard/all-events'
                icon={<BellPlus size={24} fill={getIconColor("/dashboard/all-events")}/>}
                isActive={activeSidebar === "/dashboard/all-events"}
              />
            </SidebarMenu>
            <SidebarMenu title='Controllers'>
              <SidebarItem 
                title='Inbox'
                href='/dashboard/inbox'
                icon={<Mail size={20} fill={getIconColor("/dashboard/inbox")}/>}
                isActive={activeSidebar === "/dashboard/inbox"}
              />
              <SidebarItem 
                title='Settings'
                href='/dashboard/settings'
                icon={<Settings size={24} fill={getIconColor("/dashboard/settings")}/>}
                isActive={activeSidebar === "/dashboard/settings"}
              />
              <SidebarItem 
                title='Notification'
                href='/dashboard/notification'
                icon={<BellRing size={24} fill={getIconColor("/dashboard/notification")}/>}
                isActive={activeSidebar === "/dashboard/notification"}
              />
            </SidebarMenu>
            <SidebarMenu title='Extras'>
              <SidebarItem 
                title='Discount Codes'
                href='/dashboard/discount-codes'
                icon={<TicketPercent size={22} fill={getIconColor("/dashboard/discount-codes")}/>}
                isActive={activeSidebar === "/dashboard/discount-codes"}
              />
              <SidebarItem 
                title='Logout'
                href='/'
                icon={<LogOut size={20} fill={getIconColor("/logout")}/>}
                isActive={activeSidebar === "/logout"}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  )
}

export default SidebarBarWrapper
