import React, { useState, useEffect, use } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { dummyCarData, assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useAppContext } from '../context/AppContext'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const { cars, axios } = useAppContext()
  const [input, setInput] = useState('')

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  const applyFilter = async () =>{
    if(input === '') {
      setFilteredCars(cars)
      return null
    }
    const filtered = cars.slice().filter((car) => {
    return car.brand.toLowerCase().includes(input.toLowerCase())
    || car.model.toLowerCase().includes(input.toLowerCase())
    || car.category.toLowerCase().includes(input.toLowerCase())
    || car.transmission.toLowerCase().includes(input.toLowerCase())
    })
  
  setFilteredCars(filtered)
  }
  


  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate
      })
      if (data.success) {
        setFilteredCars(data.availableCars)
        if (data.availableCars.length === 0) {
          toast('No cars available')
        }
      }
    } catch (error) {
      console.error('Error checking car availability:', error)
      toast('Error checking availability')
    }
  }

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability()
    } else {
      // If no search data, show all cars or dummy data
      setFilteredCars(cars || dummyCarData || [])
    }
  }, [pickupLocation, pickupDate, returnDate, cars])

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter()
  }, [input, cars])

  // Filter cars based on search input
  const displayCars = filteredCars.filter(car => 
    car.make?.toLowerCase().includes(input.toLowerCase()) ||
    car.model?.toLowerCase().includes(input.toLowerCase()) ||
    car.features?.some(feature => feature.toLowerCase().includes(input.toLowerCase()))
  )

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
      {/* Header + Search Bar */}
      <div className="flex flex-col items-center py-10 max-md:px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Cars</h1>
          <p className="text-gray-600">
            Browse our selection of premium vehicles available for your next adventure
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-[560px] w-full h-12 rounded-full shadow">
          {/* Optional Search Icon */}
          {assets.search_icon && (
            <img src={assets.search_icon} alt="search" className="w-5 h-5 mr-2" />
          )}
          
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />
        </div>
      </div>

      {/* Showing Count */}
      <p className="text-sm text-gray-600 mb-4">
        Showing {displayCars.length} Cars
      </p>

      {/* Car Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCars.map(car => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  )
}

export default Cars