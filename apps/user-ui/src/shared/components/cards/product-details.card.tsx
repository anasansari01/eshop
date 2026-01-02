"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import Ratings from '../rating';
import { Heart, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CartIcon from 'apps/user-ui/src/assets/svgs/cart-icon';

const ProductDetailsCard = ({data, setOpen}: {data: any, setOpen: (open: boolean) => void}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const router = useRouter();

  return (
    <div 
      className='fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50'
      onClick={()=>setOpen(false)}
    >
      <div 
        className='relative w-[90%] md:w-[70%] max-h-[90vh] overflow-y-auto min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg'
        onClick={(e)=>e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className='absolute right-2 top-2 cursor-pointer'
          onClick={()=>setOpen(false)}
        >
          <X size={25}/>
        </button>

        <div className='w-full flex flex-col md:flex-row'>
          <div className='w-full md:w-1/2 h-full'>
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage]?.url}
              width={400}
              height={400}
              className='w-full rounded-lg object-contain'
            />

            <div className='flex gap-2 mt-4'>
              {data?.images?.map((img:any, index:number)=>(
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${activeImage === index ? "border-gray-500 pt-1" : "border-transparent"} `}
                  onClick={()=>setActiveImage(index)}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className='rounded-md'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='w-full md:w-1/2 md:pl-8 mt-6 md:mt-0'>
            <div className='border-b pb-3 border-gray-200 flex items-center justify-between'>
              <div className='flex items-start gap-3'>
                <Image
                  src={data?.Shop?.avatar}
                  alt='Shop Logo'
                  width={60}
                  height={60}
                  className='rounded-full w-[60px] h-[60px] object-cover'
                />
                <div>
                  <Link href={`/shop/${data?.Shop?.id}`} className='text-lg font-medium'>
                    {data?.Shop?.name}
                  </Link>
                  <span className='block mt-1'>
                    <Ratings rating={data?.Shop?.ratings}/>
                  </span>
                  <p className='text-gray-600 mt-1 flex items-center gap-2'>
                    <MapPin size={20} />
                    {data?.Shop?.address || "Location Not Available"}
                  </p>
                </div>
              </div>

              <button 
                className='flex items-center gap-2 px-4 text-white bg-blue-600 rounded-md py-2 font-medium hover:bg-blue-700 transition'
                onClick={()=> router.push(`/inbox?shopId=${data?.Shop?.id}`)}
              >
                💬 Chat with Seller
              </button>
            </div>

            <h3 className='text-xl font-semibold mt-3'>{data?.title}</h3>
            <p className='mt-2 text-gray-700 whitespace-pre-wrap w-full'>{data?.short_description}</p>

            {data?.brand && (
              <p className='mt-2'>
                <strong>Brand:</strong> {data?.brand}
              </p>
            )}

            <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
              {data?.colors?.length > 0 && (
                <div>
                  <strong>Color:</strong>
                  <div className="flex gap-2 mt-1">
                    {data.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 cursor-pointer rounded-full border-2 ${
                          isSelected === color 
                            ? "border-gray-400 scale-110 shadow-md" 
                            : "border-transparent"
                        }`}
                        onClick={()=>setIsSelected(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {data?.sizes?.length > 0 && (
                <div>
                  <strong>Size:</strong>
                  <div className="flex gap-2 mt-1">
                    {data.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`px-4 py-1 cursor-pointer rounded-md ${
                          isSizeSelected === size 
                            ? "bg-gray-800 text-white" 
                            : "bg-gray-300 text-black"
                        }`}
                        onClick={()=>setIsSizeSelected(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                ${data?.sale_price}
              </h3>
              {data?.regular_price && (
                <h3 className="text-lg text-red-600 line-through">
                  ${data?.regular_price}
                </h3>
              )}
            </div>

            <div className="mt-5 flex items-center gap-5">
              <div className="flex items-center rounded-md overflow-hidden">
                <button
                  className="px-3 py-1 bg-gray-300 font-semibold"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100 font-medium">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 bg-gray-300 font-semibold"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <button
                disabled={data?.stock === 0}
                className={`flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition ${
                  data?.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ff5722] hover:bg-[#e64a19]"
                }`}
              >
                <CartIcon size={18}/> Add to Cart
              </button>

              <button
                className='opacity-[.7] cursor-pointer'
                onClick={() => setLiked(!liked)}
              >
                <Heart
                  size={30}
                  color="red"
                  fill={liked ? "red" : "none"}
                />
              </button>
            </div>

            <div className='mt-3'>
              {data?.stock > 0 ? (
                <span className='text-green-600 font-semibold'>In Stock</span>
              ): (
                <span className='text-red-600 font-semibold'>Out of Stock</span>
              )}
            </div>

            <div className='mt-3 text-gray-600 text-sm'>
              Estimated Delivery: <strong>{estimatedDelivery.toDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsCard;
