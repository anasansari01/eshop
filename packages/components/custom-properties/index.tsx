import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { PlusCircle, X } from 'lucide-react';
import Input from '../input';

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<{ label: string, values: string[], newValue?: string }[]>([]);
  const [newLabel, setNewLabel] = useState("");

  return (
    <div>
      <div className='flex flex-col gap-3'>
        <Controller
          name='customProperties'
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, values: [], newValue: "" }]);
              setNewLabel("");
            };

            const addValue = (index: number) => {
              const updatedProperties = [...properties];
              const current = updatedProperties[index];
              if (!current.newValue?.trim()) return;
              current.values.push(current.newValue);
              current.newValue = "";
              setProperties(updatedProperties);
            };

            const handleValueChange = (index: number, value: string) => {
              const updatedProperties = [...properties];
              updatedProperties[index].newValue = value;
              setProperties(updatedProperties);
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };

            return (
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Custom Properties
                </label>
                <div className='flex flex-col gap-3'>
                  {/* Existing Properties */}
                  {properties.map((property, index) => (
                    <div key={index} className='border border-gray-700 rounded-lg bg-gray-800 p-3'>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          {property.label}
                        </span>
                        <button
                          type='button'
                          onClick={() => removeProperty(index)}
                        >
                          <X size={18} className='text-red-500' />
                        </button>
                      </div>

                      {/* Add value to Property */}
                      <div className="flex items-center mt-2 gap-2">
                        <input
                          type="text"
                          className="border outline-none border-gray-700 bg-gray-900 p-2 rounded-md text-white w-full"
                          placeholder='Enter value...'
                          value={property.newValue || ""}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                        />
                        <button
                          type='button'
                          className='px-3 py-1 bg-blue-500 text-white rounded-md'
                          onClick={() => addValue(index)}
                        >
                          Add
                        </button>
                      </div>

                      {/* Show Values */}
                      <div className="flex flex-wrap mt-2 gap-2">
                        {property.values.map((value, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-700 text-white rounded-md text-sm break-words max-w-full">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add Property */}
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      placeholder='Enter property label (e.g., Material, Warranty)'
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />
                    <button
                      type='button'
                      className='px-3 py-2 bg-blue-500 text-white rounded-md flex items-center'
                      onClick={addProperty}
                    >
                      <PlusCircle size={16} /> Add
                    </button>
                  </div>
                </div>

                {errors.customProperties && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.customProperties.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
