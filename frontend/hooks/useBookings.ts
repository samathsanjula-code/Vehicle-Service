import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';
import { BOOKINGS_URL } from '../constants/api';

export interface Booking {
  _id: string;
  customerId: any;
  vehicleId: any;
  serviceType: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'Pending' | 'Pending Payment' | 'Confirmed' | 'Assigned' | 'Completed' | 'Cancelled';
  notes?: string;
  price?: number;
  createdAt: string;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found. Please log in again.');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchUserBookings = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const config = await getAuthHeader();
      const response = await axios.get(`${BOOKINGS_URL}/user/${userId}`, config);
      return response.data as Booking[];
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch bookings';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    setLoading(true);
    setError(null);
    try {
      const config = await getAuthHeader();
      const response = await axios.post(BOOKINGS_URL, bookingData, config);
      return response.data as Booking;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create booking';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updateData: any) => {
    setLoading(true);
    setError(null);
    try {
      const config = await getAuthHeader();
      const response = await axios.put(`${BOOKINGS_URL}/${id}`, updateData, config);
      return response.data as Booking;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update booking';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const config = await getAuthHeader();
      const response = await axios.delete(`${BOOKINGS_URL}/${id}`, config);
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete booking';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const config = await getAuthHeader();
      const response = await axios.get(`${BOOKINGS_URL}/${id}`, config);
      return response.data as Booking;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch booking';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchUserBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    fetchBookingById
  };
};