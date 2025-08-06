import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import { dummyCarData, assets } from '../assets/assets'
import Loader from '../components/Loader' 
import { useAppContext } from '../context/AppContext'

const CarDetails = () => {
  const { id } = useParams()
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!pickupDate || !returnDate) {
      toast.error('Please select both pickup and return dates')
      return
    }
    
    if (new Date(pickupDate) >= new Date(returnDate)) {
      toast.error('Return date must be after pickup date')
      return
    }
    
    try {
      // Debug: Log the booking data being sent
      console.log('Booking data being sent:', {
        car: id,
        pickupDate,
        returnDate
      })
      
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })
      
      // Debug: Log the full response
      console.log('Booking response:', data)
    
      if (data.success){
        toast.success(data.message || 'Booking created successfully!')
        navigate('/my-bookings')
      } else {
        console.error('Booking failed:', data.message)
        toast.error(data.message || 'Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      console.error('Error response:', error.response?.data)
      
      // More specific error messages
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Invalid booking data')
      } else if (error.response?.status === 409) {
        toast.error('Car is not available for the selected dates')
      } else if (error.response?.status === 404) {
        toast.error('Car not found')
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to create booking')
      }
    }
  }

  useEffect(() => {
    const foundCar = cars.find(car => car._id === id)
    setCar(foundCar)
    setLoading(false)
    
    // Debug: Log the car data and ID
    console.log('Looking for car with ID:', id)
    console.log('Found car:', foundCar)
    console.log('All car data:', dummyCarData)
  }, [cars, id])

  if (loading) {
    return <Loader />
  }

  
  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65 h-4 w-4" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car Details */}
        <div className="lg:col-span-2">
          <img 
            src={car.image} 
            alt={`${car.brand} ${car.model}`} 
            className="w-full h-auto max-h-96 object-cover rounded-xl mb-6 shadow-md" 
          />
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{car.brand} {car.model}</h1>
              <p className="text-gray-500 text-lg">{car.category} • {car.year}</p>
            </div>
          </div>
          
          <hr className="border-gray-200 my-6" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
              {icon: assets.car_icon, text: car.transmission},
              {icon: assets.fuel_icon, text: car.fuel_type},
              {icon: assets.location_icon, text: car.location}
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 bg-gray-50 p-4 rounded-lg border">
                <img src={item.icon} alt="" className="h-5 w-5 mb-2" />
                <span className="text-sm text-gray-700 text-center">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className='text-xl font-medium mb-3 text-gray-900'>Description</h2>
            <p className='text-gray-600 leading-relaxed'>{car.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className='text-xl font-medium mb-3 text-gray-900'>Features</h2>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {
                ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                  <li key={item} className='flex items-center text-gray-600 py-1'>
                    <img src={assets.check_icon} className='h-4 w-4 mr-2' alt="" />
                    {item}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">${car.pricePerDay}</span>
                <span className="text-gray-500">/day</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                <input 
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                <input 
                  value={returnDate} 
                  onChange={(e) => setReturnDate(e.target.value)}
                  type="date" 
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button 
                type="submit"
                disabled={!pickupDate || !returnDate}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : <Loader />
}

export default CarDetails