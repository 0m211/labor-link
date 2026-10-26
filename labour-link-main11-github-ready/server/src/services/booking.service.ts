// import Booking from '../models/Booking';
// import ServiceProvider from '../models/ServiceProvider';
// import User from '../models/User';
// import { getSocketInstance } from '../socket';
// import { AppError } from '../middlewares/errorHandler';
// import { sendBookingConfirmationEmail } from './email.service';

// // Generate random OTP
// const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// // ─── CREATE INSTANT BOOKING ──────────────────────────────────
// export const createInstantBooking = async (data: {
//   customerId: string;
//   serviceId: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     location: { coordinates: [number, number] };
//   };
//   problemDescription: string;
// }) => {
//   const { customerId, serviceId, address, problemDescription } = data;

//   // Create booking
//   const booking = await Booking.create({
//     customerId,
//     serviceId,
//     type: 'instant',
//     status: 'searching',
//     address: {
//       ...address,
//       location: {
//         type: 'Point',
//         coordinates: address.location.coordinates
//       }
//     },
//     problemDescription,
//     otp: {
//       start: generateOTP(),
//       end: generateOTP()
//     }
//   });

//   // Find nearby providers within 10km
//   const [lng, lat] = address.location.coordinates;
//   const providers = await ServiceProvider.find({
//     isOnline: true,
//     isVerified: true,
//     isActive: true,
//     serviceCategories: serviceId,
//     location: {
//       $near: {
//         $geometry: {
//           type: 'Point',
//           coordinates: [lng, lat]
//         },
//         $maxDistance: 10000
//       }
//     }
//   }).limit(20);

  
//   // Broadcast to all nearby providers via Socket.io
//   const io = getSocketInstance();
//   providers.forEach(provider => {
//     io.to(`provider:${provider._id}`).emit('booking:new_request', {
//       bookingId: booking._id,
//       service: serviceId,
//       address: booking.address,
//       problemDescription,
//       expiresIn: 30
//     });
//   });

//   // Auto expire booking after 30 seconds if no one accepts
//   setTimeout(async () => {
//     const current = await Booking.findById(booking._id);
//     if (current && current.status === 'searching') {
//       await Booking.findByIdAndUpdate(booking._id, { status: 'expired' });
//       io.to(`customer:${customerId}`).emit('booking:expired', {
//         bookingId: booking._id,
//         message: 'No providers available. Please try again.'
//       });
//     }
//   }, 30000);

//   return booking;
// };

// // ─── CREATE SCHEDULED BOOKING ────────────────────────────────
// export const createScheduledBooking = async (data: {
//   customerId: string;
//   serviceId: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//     location: { coordinates: [number, number] };
//   };
//   problemDescription: string;
//   scheduledAt: Date;
// }) => {
//   const booking = await Booking.create({
//     ...data,
//     type: 'scheduled',
//     status: 'pending',
//     address: {
//       ...data.address,
//       location: {
//         type: 'Point',
//         coordinates: data.address.location.coordinates
//       }
//     },
//     otp: {
//       start: generateOTP(),
//       end: generateOTP()
//     }
//   });

//   return booking;
// };

// // ─── ACCEPT BOOKING ──────────────────────────────────────────
// export const acceptBooking = async (
//   bookingId: string,
//   providerId: string
// ) => {
//   // Check booking is still searching
//   const booking = await Booking.findById(bookingId)
//     .populate('customerId')
//     .populate('serviceId');

//   if (!booking) throw new AppError('Booking not found', 404);
//   if (booking.status !== 'searching') {
//     throw new AppError('Booking already assigned or expired', 409);
//   }

//   // Assign provider
//   const updated = await Booking.findByIdAndUpdate(
//     bookingId,
//     {
//       providerId,
//       status: 'assigned',
//       acceptedAt: new Date()
//     },
//     { new: true }
//   ).populate('customerId serviceId providerId');

//   const io = getSocketInstance();
//   const customer = booking.customerId as any;

//   // Notify customer
//   io.to(`customer:${customer._id}`).emit('booking:assigned', {
//     booking: updated,
//     message: 'A professional has been assigned to your request!'
//   });

//   // Notify other providers booking is taken
//   io.emit(`booking:taken:${bookingId}`, {
//     message: 'Booking already assigned'
//   });

//   // Send confirmation email
//   const service = booking.serviceId as any;
//   await sendBookingConfirmationEmail(
//     customer.email,
//     customer.name,
//     updated!.bookingNumber,
//     service.name
//   );

//   return updated;
// };

// // ─── REJECT BOOKING ──────────────────────────────────────────
// export const rejectBooking = async (
//   bookingId: string,
//   providerId: string
// ) => {
//   return { message: 'Booking rejected' };
// };

// // ─── CANCEL BOOKING ──────────────────────────────────────────
// export const cancelBooking = async (
//   bookingId: string,
//   userId: string,
//   cancelledBy: 'customer' | 'provider' | 'admin',
//   reason: string
// ) => {
//   const booking = await Booking.findById(bookingId);
//   if (!booking) throw new AppError('Booking not found', 404);

//   if (['completed', 'cancelled', 'expired'].includes(booking.status)) {
//     throw new AppError('Cannot cancel this booking', 400);
//   }

//   const updated = await Booking.findByIdAndUpdate(
//     bookingId,
//     {
//       status: 'cancelled',
//       cancelledAt: new Date(),
//       cancelledBy,
//       cancelReason: reason
//     },
//     { new: true }
//   );

//   const io = getSocketInstance();
//   io.to(`customer:${booking.customerId}`).emit('booking:cancelled', {
//     bookingId,
//     message: 'Your booking has been cancelled'
//   });

//   if (booking.providerId) {
//     io.to(`provider:${booking.providerId}`).emit('booking:cancelled', {
//       bookingId,
//       message: 'Booking has been cancelled'
//     });
//   }

//   return updated;
// };

// // ─── GET CUSTOMER BOOKINGS ───────────────────────────────────
// export const getCustomerBookings = async (customerId: string) => {
//   return await Booking.find({ customerId })
//     .populate('serviceId', 'name icon')
//     .populate('providerId', 'name phone rating avatar')
//     .sort({ createdAt: -1 });
// };

// // ─── GET PROVIDER BOOKINGS ───────────────────────────────────
// export const getProviderBookings = async (providerId: string) => {
//   return await Booking.find({ providerId })
//     .populate('serviceId', 'name icon')
//     .populate('customerId', 'name phone avatar')
//     .sort({ createdAt: -1 });
// };

// // ─── UPDATE BOOKING STATUS ───────────────────────────────────
// export const updateBookingStatus = async (
//   bookingId: string,
//   status: string,
//   extraData: object = {}
// ) => {
//   const updated = await Booking.findByIdAndUpdate(
//     bookingId,
//     { status, ...extraData },
//     { new: true }
//   );

//   const io = getSocketInstance();
//   io.to(`customer:${updated?.customerId}`).emit('booking:status_update', {
//     bookingId,
//     status
//   });

//   return updated;
// };
import Booking from '../models/Booking';
import ServiceProvider from '../models/ServiceProvider';
import Service from '../models/Service';
import User from '../models/User';
import { getSocketInstance } from '../socket';
import { AppError } from '../middlewares/errorHandler';
import { sendBookingConfirmationEmail } from './email.service';

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const calculatePricing = (basePrice: number) => {
  const platformFeePercent = Number(process.env.PLATFORM_FEE_PERCENT) || 15
  const taxAmount = Math.floor(basePrice * 0.18)
  const totalAmount = basePrice + taxAmount
  const platformFee = Math.floor(totalAmount * platformFeePercent / 100)
  const providerEarning = totalAmount - platformFee
  return { baseAmount: basePrice, taxAmount, totalAmount, platformFee, providerEarning, discountAmount: 0, couponCode: '' }
}

export const createInstantBooking = async (data: {
  customerId: string;
  serviceId: string;
  address: any;
  problemDescription: string;
}) => {
  const { customerId, serviceId, address, problemDescription } = data;

  const service = await Service.findById(serviceId)
  const pricing = calculatePricing(service?.basePrice || 299)

  const booking = await Booking.create({
    customerId,
    serviceId,
    type: 'instant',
    status: 'searching',
    address: {
      ...address,
      location: { type: 'Point', coordinates: address.location.coordinates }
    },
    problemDescription,
    pricing,
    otp: { start: generateOTP(), end: generateOTP() }
  });

  const [lng, lat] = address.location.coordinates;

  const debugProviders = await ServiceProvider.find({});

console.log("========== PROVIDER DEBUG ==========");
console.log("Customer Service ID:", serviceId);
console.log("Customer Coordinates:", [lng, lat]);

debugProviders.forEach((p: any) => {
  console.log({
    id: p._id,
    services: p.services,
    isOnline: p.isOnline,
    isVerified: p.isVerified,
    isActive: p.isActive,
    coordinates: p.location?.coordinates
  });
});
console.log("Requested Service ID:", serviceId);
const provider = await ServiceProvider.findOne({ email: "pranshupatil26@gmail.com" });

console.log("========== CHECK ==========");
console.log("Requested Service ID:", serviceId);

const supplier = await ServiceProvider.findById("6a3cb9224d9f3e2d005bdc18");

console.log("Provider services:", provider?.services);
console.log(
  "Equal?:",
  provider?.services?.[0]?.toString() === serviceId.toString()
);
console.log("Provider Services:", provider?.services);
console.log("===========================");
const providers = await ServiceProvider.find({
  isOnline: true,
  isVerified: true,
  isActive: true,
  services: serviceId
}).limit(20);
console.log("Matched Providers:", providers.length);

providers.forEach((p: any) => {
  console.log("Provider Services:", p.services);
});
console.log("Providers Found:", providers.length);

console.log("Matched Providers:", providers.length);
console.log("====================================");
  console.log("Customer Coordinates:", [lng, lat]);
  console.log("Customer Service:", serviceId);
  console.log("Providers Found:", providers.length);

  const allProviders = await ServiceProvider.find({});
  console.log("All Providers:", allProviders);

  if (providers.length === 0) {
    await Booking.findByIdAndUpdate(booking._id, { status: 'expired' });
    throw new AppError('No providers available in your area right now', 404);
  }

  const io = getSocketInstance();
  providers.forEach(provider => {
    io.to(`provider:${provider._id}`).emit('booking:new_request', {
      bookingId: booking._id,
      service: serviceId,
      address: booking.address,
      problemDescription,
      expiresIn: 30
    });
  });

  setTimeout(async () => {
    const current = await Booking.findById(booking._id);
    if (current && current.status === 'searching') {
      await Booking.findByIdAndUpdate(booking._id, { status: 'expired' });
      io.to(`customer:${customerId}`).emit('booking:expired', {
        bookingId: booking._id,
        message: 'No providers available. Please try again.'
      });
    }
  }, 30000);

  return booking;
};

export const createScheduledBooking = async (data: {
  customerId: string;
  serviceId: string;
  address: any;
  problemDescription: string;
  scheduledAt: Date;
}) => {
  const service = await Service.findById(data.serviceId)
  const pricing = calculatePricing(service?.basePrice || 299)

  const booking = await Booking.create({
    ...data,
    type: 'scheduled',
    status: 'pending',
    address: {
      ...data.address,
      location: { type: 'Point', coordinates: data.address.location.coordinates }
    },
    pricing,
    otp: { start: generateOTP(), end: generateOTP() }
  });

  return booking;
};

export const acceptBooking = async (bookingId: string, providerId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate('customerId')
    .populate('serviceId');

  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'searching' && booking.status !== 'pending') {
    throw new AppError('Booking already assigned or expired', 409);
  }

  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    { providerId, status: 'assigned', acceptedAt: new Date() },
    { new: true }
  ).populate('customerId serviceId providerId');

  const io = getSocketInstance();
  const customer = booking.customerId as any;

  io.to(`customer:${customer._id}`).emit('booking:assigned', {
    booking: updated,
    message: 'A professional has been assigned to your request!'
  });

  io.emit(`booking:taken:${bookingId}`, { message: 'Booking already assigned' });

  try {
    const service = booking.serviceId as any;
    await sendBookingConfirmationEmail(
      customer.email,
      customer.name,
      updated!.bookingNumber,
      service.name
    );
  } catch (err) {
    console.error('Email send failed:', err)
  }

  return updated;
};

export const rejectBooking = async (bookingId: string, providerId: string) => {
  return { message: 'Booking rejected' };
};

export const cancelBooking = async (
  bookingId: string,
  userId: string,
  cancelledBy: 'customer' | 'provider' | 'admin',
  reason: string
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404);
  if (['completed', 'cancelled', 'expired'].includes(booking.status)) {
    throw new AppError('Cannot cancel this booking', 400);
  }

  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'cancelled', cancelledAt: new Date(), cancelledBy, cancelReason: reason },
    { new: true }
  );

  const io = getSocketInstance();
  io.to(`customer:${booking.customerId}`).emit('booking:cancelled', { bookingId });
  if (booking.providerId) {
    io.to(`provider:${booking.providerId}`).emit('booking:cancelled', { bookingId });
  }

  return updated;
};

export const getCustomerBookings = async (customerId: string) => {
  return await Booking.find({ customerId })
    .populate('serviceId', 'name icon')
    .populate('providerId', 'name phone rating avatar')
    .sort({ createdAt: -1 });
};

export const getProviderBookings = async (providerId: string) => {
  return await Booking.find({ providerId })
    .populate('serviceId', 'name icon')
    .populate('customerId', 'name phone avatar')
    .sort({ createdAt: -1 });
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const updated = await Booking.findByIdAndUpdate(
    bookingId,
    { status, ...(status === 'completed' ? { completedAt: new Date() } : {}), ...(status === 'arrived' ? { arrivedAt: new Date() } : {}), ...(status === 'in_progress' ? { startedAt: new Date() } : {}) },
    { new: true }
  );

  const io = getSocketInstance();
  io.to(`customer:${updated?.customerId}`).emit('booking:status_update', { bookingId, status });

  return updated;
};