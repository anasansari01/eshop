import Link from 'next/link';
import React from 'react'

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href: string;
}

const SidebarItem = ({title, icon, isActive, href}: Props) => {
  return (
    <Link href={href} className='block my-2'>
      <div className={`flex gap-2 w-full min-h-12 h-full items-center px-[13px] rounded-lg cursor-pointer transition hover: bg-[#2b2f31] ${isActive && "scale-[.98] bg-[#0f3158] fill-blue-200 hover:!bg-[#0f3158d6]"}`}>
        {icon}
        <h5 className='text-slat-200 text-lg'>
          {title}
        </h5>
      </div>
    </Link>
  )
}

export default SidebarItem
