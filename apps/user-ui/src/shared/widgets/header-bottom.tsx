"use client"
import { AlignLeft, ChevronDown, ChevronRight, HeartIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { navItems } from '../../config/constants';
import Link from 'next/link';
import {useQuery} from "@tanstack/react-query"
import ProfileIcon from '../../assets/svgs/profile-icon';
import CartIcon from '../../assets/svgs/cart-icon';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from '../../store';
import axiosInstance from '../../utils/axiosInstance';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { user, isLoading } = useUser();
  const wishlist = useStore((state:any)=>state.wishlist);
  const cart = useStore((state:any)=>state.cart);

  const {data} = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
          const res = await axiosInstance.get("/product/api/get-categories");
          console.log(res);
          return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });


  useEffect(()=>{
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  },[]);

  return (
    <div className={`w-full transition-all duration-300 ${isSticky ?
     "fixed top-0 left-0 z-[100] bg-white shadow-lg" :
     "relative"}`}>
      <div className={`w-[80%] relative m-auto flex items-center justify-between ${isSticky ? "pt-3" : "py-0"}`}>

        <div
          className={`w-[260px] ${isSticky && "-mb-2"} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
          onClick={()=>setShow(!show)}
        >
          <div className='flex items-center gap-2'>
            <AlignLeft color='white' />
            <span className='text-white font-medium'>All Departments</span>
          </div>
          <ChevronDown color='white'/>
        </div>

        {show && (
          <div className={`absolute left-0 ${isSticky ? "top-[70px]" : "top-[50px]"} w-[260px] h-[400px] bg-[#f5f5f5]`}>
            {data?.categories?.map((cat: string, i:number)=>{
              const hasSub = data.subCategories?.[cat]?.length > 0;
              const isExpanded = expandedCategory === cat;

              return (
                <div key={i} className='relative'>
                  <button
                    onClick={()=>{
                      if (hasSub) {
                        setExpandedCategory(prev => prev === cat ? null : cat);
                      } else {
                        setShow(false);
                        window.location.href = `/product?category=${encodeURIComponent(cat)}`;
                      }
                    }}
                    className='w-full flex items-center justify-between px-5 py-2'
                  >
                    <span>{cat}</span>
                    {hasSub && (
                      isExpanded
                        ? <ChevronDown className='w-4 h-4 text-gray-500'/>
                        : <ChevronRight className='w-4 h-4 text-gray-500'/>
                    )}
                  </button>

                  {isExpanded && hasSub && (
                    <div className='pl-4 bg-gray-50 border-t'>
                      {data.subCategories[cat].map((sub:string, j:number)=>(
                        <Link
                          key={j}
                          href={`/product?category=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`}
                          className='block px-4 py-2 text-sm text-gray-700'
                          onClick={()=>setShow(false)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {!data?.categories?.length && (
              <p className='px-5 py-2 text-sm text-gray-500'>
                No categories found.
              </p>
            )}
          </div>
        )}

        <div className='flex items-center'>
          {navItems.map((i:any, index: number) => (
            <Link
              className='px-5 font-medium text-lg'
              key={index}
              href={i.href}
            >
              {i.title}
            </Link>
          ))}
        </div>

        <div>
          {isSticky && (
            <div className='flex items-center gap-8 pb-2'>
              <div className='flex items-center gap-2'>
                {!isLoading && user ? (
                  <>
                    <Link
                      href={"/profile"}
                      className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]'
                    >
                      <ProfileIcon/>
                    </Link>
                    <Link href={"/profile"}>
                      <span className='block font-medium'>Hello, </span>
                      <span className='font-semibold'>{user?.name.split(" ")[0]}</span>
                    </Link>
                  </>
                ): (
                  <>
                    <Link
                      href={"/login"}
                      className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]'
                    >
                      <ProfileIcon />
                    </Link>
                    <Link href={"/login"}>
                      <span className='block font-medium'>Hello, </span>
                      <span className='font-semibold'>{isLoading? "..." : "Sign In"}</span>
                    </Link>
                  </>
                )}
              </div>

              <div className='flex items-center gap-5'>
                <Link href={"/wishlist"} className='relative'>
                  <HeartIcon />
                  <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                    <span className='text-white font-medium text-sm'>{wishlist?.length}</span>
                  </div>
                </Link>
                <Link href={"/cart"} className='relative'>
                  <CartIcon />
                  <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                    <span className='text-white font-medium text-sm'>{cart?.length}</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default HeaderBottom;
