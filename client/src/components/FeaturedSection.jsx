import React from 'react'
import Title from './Title'

import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
    const navigate = useNavigate()
    const {cars} =useAppContext()
    
    return (
        <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div>
                <Title title='Featured Vehicles' subTitle='Explore our exclusive selection of luxury cars available for rent.' align='center' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16'>
                {
                    cars.slice(0,6).map((car) => (
                        <div key={car._id} className='w-full'>
                            <CarCard car={car} />
                        </div>
                    ))
                }
            </div>
            <button 
                onClick={() => {
                    navigate('/cars');
                    window.scrollTo(0, 0);
                }}
                className='flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-md mt-16 cursor-pointer'
            >
                Explore All Cars
            </button>
        </div>
    )
}

export default FeaturedSection