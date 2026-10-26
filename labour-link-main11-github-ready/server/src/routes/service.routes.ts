import { Router, Request, Response } from 'express';
import Service from '../models/Service';
import ServiceProvider from '../models/ServiceProvider';
import { sendSuccess } from '../utils/response';

const router = Router();

// Get all services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    sendSuccess(res, 'Services fetched', services);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get providers near location for a service
router.get('/:id/providers', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    const { id } = req.params;

    const providers = await ServiceProvider.find({
      isOnline: true,
      isVerified: true,
      services: id,
      location: {
      $near: {
      $geometry: {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)]
      },
      $maxDistance: Number(radius) * 1000
    }
  }
})
.select('name rating avatar experience')
.limit(10);

    sendSuccess(res, 'Providers fetched', providers);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;