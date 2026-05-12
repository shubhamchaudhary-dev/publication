import { Router, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { uploadImage } from '../utils/cloudinary';

const router = Router();

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  institution: z.string().max(200).optional(),
});

// GET /api/users/me
router.get('/me', authenticate, (req: AuthRequest, res: Response): void => {
  const user = req.user!;
  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, institution: user.institution },
  });
});

// PUT /api/users/me
router.put('/me', authenticate, uploadImage.single('avatar'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateSchema.parse(req.body);
    const update: Record<string, unknown> = {};
    if (data.name) update.name = data.name;
    if (data.institution !== undefined) update.institution = data.institution;
    if (req.file) {
      update.avatarUrl = (req.file as Express.Multer.File & { path: string }).path;
    }
    const user = await User.findByIdAndUpdate(req.user!._id, update, { new: true }).select('-passwordHash');
    res.json({
      success: true,
      data: { id: user!._id, name: user!.name, email: user!.email, role: user!.role, avatarUrl: user!.avatarUrl, institution: user!.institution },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: err.errors[0].message });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
