'use client'
import { useQuery } from '@tanstack/react-query';
import ImagePlaceholder from 'apps/seller-ui/src/shared/components/image-placeholder';
import { enchancement } from 'apps/seller-ui/src/utils/AI.enchancement';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { ChevronRight, Wand, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input';
import RichTextEditor from 'packages/components/rich-text-editor';
import SizeSelector from 'packages/components/size-selector';
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast';

interface UploadedImage {
  fileId: string,
  file_url: string,
};

const page = () => {
  const {register, control, watch, setValue, handleSubmit, formState: {errors}} = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const {data, isLoading, isError} = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
          const res = await axiosInstance.get("/product/api/get-categories");
          return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const {data: discountCodes = [], isLoading: discountLoading} = useQuery({
      queryKey: ["shop-discounts"],
      queryFn:  async () => {
        const res = await axiosInstance.get("/product/api/get-discount-codes");
        console.log(res);
        return res?.data?.discount_codes || [];
      }
    });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subcategories = useMemo(()=>{
    return selectedCategory ? subCategoriesData[selectedCategory] || []:[];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axiosInstance.post("/product/api/create-product", data);
      router.push("/dashboard/all-products");
    } catch (error:any) {
      toast.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })
  }

  const handleImageChange = async (file: File | null, index: number) => {
    if(!file) return;
    setPictureUploadingLoader(true);
    try {
      const fileName = await convertToBase64(file);

      const response = await axiosInstance.post(`/product/api/upload-product-image`, {fileName});

      const uploadedImage: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url
      }
      
      const updatedImages = [...images];

      updatedImages[index] = uploadedImage;

      if(index === images.length-1 && updatedImages.length<8){
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.log(error);   
    } finally{
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveChange = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];

      if(imageToDelete && typeof imageToDelete === "object"){
        await axiosInstance.delete("/product/api/delete-product-image", {
          data: { 
          fileId: imageToDelete.fileId,
          }
        });
      }

      updatedImages.splice(index, 1);

      // add null placeholder
      if(!updatedImages.includes(null) && updatedImages.length<8){
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);

    } catch (error) {
      console.log(error);
    }
  }

  const applyTransformation = async (transformation: string) => {
    if(!selectedImage || processing) return;
    setProcessing(true);
    setActiveEffect(transformation);
    try {
      const transformedUrl = `${selectedImage}?tr=${transformation}`;
      setSelectedImage(transformedUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  }

  const handleSaveDraft = () => {}

  return (
    <form className='w-full mx-auto p-8 shadow-md rounded-lg text-white'
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading & Breadcrumbs */}
      <h2 className='text-2xl py-2 font-semibold font-Poppins text-white'>
        Create Products
      </h2>
      <div className='flex items-center'>
        <span className='text-[#80Deea] cursor-pointer'>Dashboard</span>
        <ChevronRight size={20} className='opacity-[.8]'/>
        <span>Create Product</span>
      </div>
      {/* Content Layout */}
      <div className='py-4 w-full flex gap-6'>
        {/*  Left side - Image upload section */}
        <div className='md:w-[35%]'>
          {images?.length > 0 && (
            <ImagePlaceholder
            setOpenImageModal={setOpenImageModal}
            size='768 x 850'
            small={false}
            images={images}
            index={0}
            onImageChange={handleImageChange}
            pictureUploadingLoader={pictureUploadingLoader}
            setSelectedImage={setSelectedImage}
            onRemove={handleRemoveChange}
            />
          )}
          <div className='grid grid-cols-2 gap-3 mt-4'>
            {images?.slice(1).map((_, index) => (
              <ImagePlaceholder 
              setOpenImageModal={setOpenImageModal}
              size='768 x 850'
              key={index}
              small={true}
              images={images}
              index={index + 1}
              onImageChange={handleImageChange}
              pictureUploadingLoader={pictureUploadingLoader}
              setSelectedImage={setSelectedImage}
              onRemove={handleRemoveChange}
              />
            ))}
          </div>
        </div>
        {/* Right size - form inputs */}
        <div className='md:w-[65%]'>
          <div className='w-full flex gap-6'>
            {/* Product Title Input */}
            <div className='w-2/4'>
              <Input
                label='Product Title *'
                placeholder='Enter product title'
                {...register("title", {required: "Title is required!"})}
              /> 
              {errors.title && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.title.message as string}
                </p>
              )}
              <div className='mt-2'>
                <Input
                  label='Short Description * (Max 150 words)'
                  placeholder='Enter product description for quick view'
                  rows={7}
                  cols={10}
                  type='textarea'
                  {...register("short_description", {required: "Description is required!",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return(
                        wordCount <= 150 ||  `Description cannot exceed 150 words (current: ${wordCount})`
                      );
                    },
                  })}
                /> 
                {errors.short_description && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.short_description.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Tags *'
                  placeholder='apple, flagship'
                  {...register("tags", {required: "Seperate related products tags with a coma"})}
                /> 
                {errors.tags && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.tags.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Warranty *' 
                  placeholder='1 Year / No Warranty'
                  {...register("warranty", {required: "Warranty is required!"})}
                /> 
                {errors.warranty && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                <Input
                  label='Slug *' 
                  placeholder='product_slug'
                  {...register("slug", {required: "Slug is required!", 
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: "Invalid slug format! Use only lowercase letters, numbers"
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 character long."
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug cannot be longer than 50 characters."
                    }
                  })}
                /> 
                {errors.slug && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
              <div className='mt-2'>
                  <Input
                    label='Brand *' 
                    placeholder='Apple'
                    {...register("brand", {required: "Brand is required!"})}
                  /> 
                  {errors.brand && (
                    <p className='text-red-500 textt-xs mt-1'>
                      {errors.brand.message as string}
                    </p>
                  )}
                </div>
              <div className='mt-2'>
                {/* Color Selector */}
                <ColorSelector control={control} errors={errors}/>
              </div>
              <div className='mt-2'>
                <CustomSpecifications control={control} errors={errors}/>
              </div>
              <div className='mt-2'>
                <CustomProperties control={control} errors={errors}/>
              </div>
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1 rounded-lg">
                  Cash On Delivery *
                </label>
                <select 
                {...register("cash_on_delivery", {
                  required: "Cash on delivery is required"
                })}
                defaultValue="yes"
                className='w-full border outline-none border-gray-700 bg-transparent'
                >
                  <option value="yes" className='bg-black'>
                    Yes
                  </option>
                  <option value="no" className='bg-black'>
                    No
                  </option>
                </select>
                {errors.cash_on_delivery && (
                    <p className='text-red-500 textt-xs mt-1'>
                      {errors.cash_on_delivery.message as string}
                    </p>
                  )}
              </div>
            </div>
            <div className="w-2/4">
                  <label className="block font-semibold text-gray-300 mb-1">
                    Category *
                  </label>
                  {
                    isLoading ? (
                      <p className='text-gray-400'> Loading categories...</p>
                    ) : isError ? (
                      <p className='text-red-500'>Failed to load categories</p>
                    ) : (
                      <Controller
                        name='category'
                        control={control}
                        rules={{required: "Categories is required"}}
                        render={({field}) => (
                          <select 
                            {...field}
                            className='w-full border outline-none rounded-md  border-gray-700 bg-transparent p-2'
                          >
                            <option value="" className='bg-black'>Select Category</option>
                            {categories?.map((category: string)=>(
                              <option value={category} key={category} className='bg-black'>
                                {category}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    )
                  }{errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message as string}
                    </p>
                  )}
                  <div className='mt-2'>
                    <label className='block font-semibold text-gray-300 mb-1'>
                      Subcategory *
                    </label>
                    <Controller
                        name='subCategory'
                        control={control}
                        rules={{required: "Subcategories is required"}}
                        render={({field}) => (
                          <select 
                            {...field}
                            className='w-full border outline-none rounded-md  border-gray-700 bg-transparent p-2'
                          >
                            <option value="" className='bg-black'>Select Subcategory</option>
                            {subcategories?.map((subcategory: string)=>(
                              <option value={subcategory} key={subcategory} className='bg-black'>
                                {subcategory}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.subCategory && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.subCategory.message as string}
                        </p>
                      )}
                  </div>
                  <div className="mt-2">
                    <label className="block font-semibold text-gray-300 mb-1">
                      Detailed Description * (Min 100 words)
                    </label>
                    <Controller
                      name='detailed_description'
                      control={control}
                      rules={{
                        required:"Detailed description is required!",
                        validate: (value) => {
                          const wordCount = value?.split(/\s+/).filter((word: string) => word).length;
                          return(
                            wordCount>=100 || "Description must be atleast 100 words!"
                          );
                        },
                      }}
                      render={({field})=>(
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.detailed_description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.detailed_description.message as string}
                        </p>
                      )}
                  </div>
                  <div className="mt-2">
                    <Input 
                      label='Video URL'
                      placeholder='https://www.youtube.com/embed/xyz123'
                      {...register("video_url", {
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[A-Za-z0-9_-]{11}$/,
                          message: "Invalid YouTube embed URL! Expected format: https://www.youtube.com/embed/xyz123",
                        },
                      })}
                    />
                    {errors.video_url && (
                      <p className='text-red-500 text-xs  mt-1'>
                        {errors.video_url.message as string}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <Input 
                      label='Regular Price'
                      placeholder='20$'
                      {...register("regular_price", {
                        required: "Regular price is required",
                        valueAsNumber: true,
                        min: {value: 1, message: "Price must be at least 1"},
                        validate: (value) => 
                          !isNaN(value) || "Only  numbers are allowed",
                      })}
                    />
                    {errors.regular_price && (
                      <p className='text-red-500 text-xs  mt-1'>
                        {errors.regular_price.message as string}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <Input 
                      label='Sales Price'
                      placeholder='15$'
                      {...register("sale_price", {
                        required: "Sales price is required",
                        valueAsNumber: true,
                        min: {value: 1, message: "Sales Price must be at least 1"},
                        validate: (value) => {
                          if(isNaN(value)){ return "Only  numbers are allowed"};
                          if(regularPrice && value >= regularPrice){
                            return "Sales Price must be less than Regular Price"
                          }
                          return true;
                        }
                      })}
                    />
                    {errors.sale_price && (
                      <p className='text-red-500 text-xs  mt-1'>
                        {errors.sale_price.message as string}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <Input 
                      label='Stock *'
                      placeholder='100'
                      {...register("stock", {
                        required: "Stock is required",
                        valueAsNumber: true,
                        min: {value: 1, message: "Stock must be at least 1"},
                        max: {
                          value: 1000,
                          message: "Stock cannot exceeds 1000"
                        },
                        validate: (value) => {
                          if(isNaN(value)){ return "Only  numbers are allowed"};
                          if(!Number.isInteger(value)){
                            return "Stock must be a Whole number!"
                          }
                          return true;
                        },
                      })}
                    />
                    {errors.stock && (
                      <p className='text-red-500 text-xs  mt-1'>
                        {errors.stock.message as string}
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <SizeSelector control={control} errors={errors}/>
                  </div>
                  <div className='mt-3'>
                    <label className='block font-semibold text-gray-300 mb-1'>Select Discount Codes (Optional)</label>
                    {discountLoading ? (
                      <p className='text-gray-400'>Loading discount codes...</p>
                    ):(
                      <div className='flex flex-wrap gap-2'>
                        {discountCodes?.map((code: any) => {
                          const selected = watch("discountCodes") || [];
                          const codeId = String(code.id);

                          return (
                            <button
                              key={code.id}
                              type='button'
                              className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                                selected.includes(codeId)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                              }`}
                              onClick={() => {
                                const updatedSelection = selected.includes(codeId)
                                  ? selected.filter((id: string) => id !== codeId)
                                  : [...selected, codeId];

                                setValue("discountCodes", updatedSelection);
                              }}
                            >
                              {code.public_name} ({code.discountValue})
                              {code.discountType === "percentage" ? "%" : "$"}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
            </div>
          </div>
        </div>
      </div>  

      {openImageModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className='bg-gray-800 text-white p-6 rounded-lg w-[450px]'>
            <div className='flex justify-between items-center pb-3 mb-3'>
              <h2 className='font-semibold text-lg'>Enhance Product Image</h2>
              <X size={20} className='cursor-pointer' onClick={()=>setOpenImageModal(!openImageModal)}/>
            </div>
            <div className='relative w-full h-[250px] border border-gray-600 rounded-md overflow-hidden'>
              <Image 
                src={selectedImage}
                alt="product-image"
                fill
              />
            </div>
            {selectedImage && (
              <div className='mt-4 space-y-2'>
                <h3 className='text-sm text-white font-semibold'>
                  AI Enhancement
                </h3>
                <div className='grid grid-cols-2 gap-3 mx-h-[250px] overflow-y-auto'>
                  {enchancement?.map(({label, effect})=>(
                    <button 
                      key={effect}
                      className={`p-2 rounded-md flex items-center gap-2 ${activeEffect === effect ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
                      onClick={()=>applyTransformation(effect)}
                      disabled={processing}
                    >
                      <Wand size={20}/>{label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 justify-end flex gap-3">
        {isChanged && (
          <button 
          type='button'
          onClick={handleSaveDraft}
          className='px-4 py-2 bg-gray-700 text-white rounded-md'
          >
            Save Draft
          </button>
        )}
          <button 
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md'
          disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
      </div>
    </form>
  )
}

export default page