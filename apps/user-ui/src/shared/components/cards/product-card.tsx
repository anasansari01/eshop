import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Ratings from '../rating';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import ProductDetailsCard from './product-details.card';
import { useStore } from 'apps/user-ui/src/store';
import useUser from 'apps/user-ui/src/hooks/useUser';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';

const ProductCard = ({product, isEvent}:{product:any; isEvent?: boolean}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const addToCart = useStore((state:any)=>state.addToCart);
  const addToWishList = useStore((state:any)=>state.addToWishList);
  const removeFromWishList = useStore((state:any)=>state.removeFromWishList);
  const cart = useStore((state:any)=>state.cart);
  const isInCart = cart.some((item:any)=>item.id===product.id);
  const wishlist = useStore((state:any)=>state.wishlist);
  const isWishListed = wishlist.some((item:any)=>item.id===product.id);
  
  useEffect(() => {
    if (isEvent && product?.ending_date) {
      const interval = setInterval(() => {
        const endTime = new Date(product.ending_date).getTime();
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`);
      }, 60000); 

      return () => clearInterval(interval);
    }
  }, [isEvent, product?.ending_date]);

  return (
    <div className='w-full min-h-[350px] h-max bg-white rounded-lg relative'>
      {isEvent && (
        <div className='absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md'>
          OFFER
        </div>
      )}
      {product?.stock <= 5 && (
          <div className='absolute top-2 right-2 bg-yellow-400 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md'>
            Limited Stock 
          </div>
      )}

      <Link href={`/product/${product?.slug}`}>
        <Image
          src={
            product?.images[0]?.url ||
            "https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=500&auto=format"
          }
          alt={product?.title}
          width={300}
          height={300}
          className="w-full h-[200px] object-cover mx-auto rounded-t-md"
        />
      </Link>
      <Link href={`/shop/${product?.shop?.id}`}
        className="block text-blue-500 text-sm font-medium my-2 px-2"
      >
        {product?.Shop?.name}
      </Link>
      <Link href={`/product/${product?.slug}`}
        className="text-base font-semibold px-2 text-gray-800"
      >
        {product?.title}
      </Link>

      <div className='mt-2 px-2'>
          <Ratings rating={product?.ratings}/>
      </div>

      <div className="mt-3 flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product?.sale_price}
          </span>
          <span className="text-sm line-through text-gray-400">
            ${product?.regular_price}
          </span>
        </div>
        <span className='text-green-500 text-sm font-medium'>
          {product.totalSales} sold
        </span>
      </div>
      
      {isEvent && timeLeft && (
        <div className='mt-2'>
          <span className='inline-block text-xs bg-orange-100 text-orange-700'>
            {timeLeft}
          </span>
        </div>
      )}

      <div className='absolute z-10 flex flex-col gap-3 right-3 top-10'>
        <div className='bg-white rounded-full p-[6px] shadow-md'>
          <Heart
            size={22}
            className='cursor-pointer hover:scale-110 transition'
            fill={isWishListed ? "red" : "transparent"}
            stroke={isWishListed ? "red" : "#4B5563"}
            onClick={()=>isWishListed ? removeFromWishList(product.id, user, location, deviceInfo) : addToWishList({...product, quantity:1}, user, location, deviceInfo)}
          />
        </div>
        <div className='bg-white rounded-full p-[6px] shadow-md'>
          <Eye
            size={22}
            className='cursor-pointer  text-[#4b5563] hover:scale-110 transition'
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className='bg-white rounded-full p-[6px] shadow-md'>
          <ShoppingBag
            size={22}
            className='cursor-pointer text-[#4b5563] hover:scale-110 transition'
            onClick={()=>!isInCart && addToCart({...product, quantity:1}, user, location, deviceInfo)}
          />
        </div>
        {open && (
          <ProductDetailsCard data={product} setOpen={setOpen}/>
        )}
      </div>
    </div>
  )
}

export default ProductCard
