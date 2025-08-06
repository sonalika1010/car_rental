import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import calendar_icon_colored from "../assets/calendar_icon_colored.svg";
import location_icon_colored from "../assets/location_icon_colored.svg";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/user');
      console.log('Bookings response:', data); // Debug log
      
      if (data.success) {
        setBookings(data.bookings);
        console.log('Fetched bookings:', data.bookings); // Debug log
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="my-8 px-4 md:px-10 flex justify-center">
        <div className="text-center">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="my-8 px-4 md:px-10">
      <Title title="My Bookings" subtitle="View and manage your all car bookings" />

      <div className="flex flex-col gap-6 mt-6">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400">Your car rental bookings will appear here</p>
          </div>
        ) : (
          bookings.map((booking, index) => (
            <div
              key={booking._id || index}
              className="bg-white shadow rounded-xl p-4 md:p-6 grid md:grid-cols-4 gap-4 items-center"
            >
              {/* Car Image */}
              <img
                src={booking.car?.image || booking.image || assets.default_car}
                alt={booking.car?.name || booking.name || 'Car'}
                className="w-full md:w-40 rounded-xl object-cover"
              />

              {/* Booking Info */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Booking #{booking.bookingNumber || index + 1}</p>
                  <p
                    className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status || 'pending'}
                  </p>
                </div>

                {/* Rental Period */}
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={calendar_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    <p>
                      {booking.pickupDate?.split('T')[0] || 'N/A'} to{" "}
                      {booking.returnDate?.split('T')[0] || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Pick-up Location */}
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={location_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Pick-up Location</p>
                    <p>{booking.car?.location || booking.location || 'Location not available'}</p>
                  </div>
                </div>

                {/* Car Details */}
              <div>
                <p className="font-semibold">{booking.name}</p>
                <p className="text-sm text-gray-500">{booking.details}</p>
              </div>
            </div>

              {/* Price Section */}
              <div className="md:col-span-1 flex flex-col justify-between gap-6 text-right">
                <div className="text-sm text-gray-500">
                  <p>Total Price</p>
                  <h1 className="text-2xl font-semibold text-primary">
                    {currency}
                    {booking.totalPrice || booking.price || '0'}
                  </h1>
                  <p>Booked on {booking.createdAt?.split("T")[0] || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;