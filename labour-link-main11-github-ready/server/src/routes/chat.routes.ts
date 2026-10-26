import { Router, Response } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import Chat from '../models/Chat';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/booking/:bookingId', protect, async (req: AuthRequest, res: Response) => {
  try {
    let chat = await Chat.findOne({ bookingId: req.params.bookingId })
    if (!chat) {
      chat = await Chat.create({
        bookingId: req.params.bookingId,
        participants: [],
        messages: []
      })
    }
    sendSuccess(res, 'Chat fetched', chat)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.post('/booking/:bookingId/send', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body
    const chat = await Chat.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      {
        $push: {
          messages: {
            senderId: req.user!.id,
            text,
            createdAt: new Date()
          }
        }
      },
      { new: true, upsert: true }
    )
    sendSuccess(res, 'Message sent', chat)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router;