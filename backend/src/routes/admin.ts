
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import Paper from '../models/Paper';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { cacheDelPattern } from '../utils/redis';
import { uploadBase64 } from '../utils/cloudinary';

const router = Router();

router.use(authenticate, requireRole('admin'));

// GET /api/admin/stats
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalPapers, published, underReview, submitted, rejected] = await Promise.all([
      User.countDocuments(),
      Paper.countDocuments(),
      Paper.countDocuments({ status: 'published' }),
      Paper.countDocuments({ status: 'under_review' }),
      Paper.countDocuments({ status: 'submitted' }),
      Paper.countDocuments({ status: 'rejected' }),
    ]);

    res.json({
      success: true,
      data: { totalUsers, totalPapers, published, underReview, submitted, rejected },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/papers
router.get('/papers', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, subject, page = '1', limit = '20' } = req.query as Record<string, string>;
    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;
    if (subject) query.subject = subject;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [papers, total] = await Promise.all([
      Paper.find(query)
        .populate('subject', 'name slug')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Paper.countDocuments(query),
    ]);

    res.json({ success: true, data: papers, pagination: { page: pageNum, limit: limitNum, total } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/users
router.get('/users', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({ role: z.enum(['reader', 'researcher', 'admin']) });
    const { role } = schema.parse(req.body);

    if (req.params.id === req.user!._id.toString()) {
      res.status(400).json({ success: false, message: 'Cannot change your own role' });
      return;
    }

    // Only root admin can assign or remove the admin role
    const targetUser = await User.findById(req.params.id).select('-passwordHash');
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isAdminChange = role === 'admin' || targetUser.role === 'admin';
    if (isAdminChange && !req.user!.isRootAdmin) {
      res.status(403).json({ success: false, message: 'Only the Root Admin can assign or remove admin roles' });
      return;
    }

    targetUser.role = role as any;
    await targetUser.save();

    res.json({ success: true, data: targetUser });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: err.errors[0].message });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.params.id === req.user!._id.toString()) {
      res.status(400).json({ success: false, message: 'Cannot delete your own account' });
      return;
    }

    // Find target user first to check if they are root admin
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Protect root admin from deletion — by DB flag OR by env email
    const rootAdminEmail = process.env.ROOT_ADMIN_EMAIL?.toLowerCase().trim();
    if (targetUser.isRootAdmin || (rootAdminEmail && targetUser.email === rootAdminEmail)) {
      res.status(403).json({ success: false, message: 'The Root Admin account cannot be deleted' });
      return;
    }

    await targetUser.deleteOne();
    await cacheDelPattern('papers:*');
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/papers/:id/review
router.put('/papers/:id/review', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      status: z.enum(['submitted', 'under_review', 'rejected', 'published']),
      remarks: z.string().max(2000).optional(),
    });
    
    const { status, remarks } = schema.parse(req.body);

    const updateData: Record<string, any> = { status, remarks };
    if (status === 'published') {
      updateData.publishedAt = new Date();
    }

    const paper = await Paper.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!paper) {
      res.status(404).json({ success: false, message: 'Paper not found' });
      return;
    }

    await cacheDelPattern('papers:*');
    res.json({ success: true, data: paper });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: err.errors[0].message });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/papers/:id/upload-pdf
// Upload the final formatted PDF for a published paper.
// Stores the base64 data URI directly (same approach as user submissions).
router.post('/papers/:id/upload-pdf', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      res.status(400).json({ success: false, message: 'pdfBase64 is required' });
      return;
    }

    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { publishedPdfUrl: pdfBase64, status: 'published', publishedAt: new Date() },
      { new: true }
    );
    if (!paper) {
      res.status(404).json({ success: false, message: 'Paper not found' });
      return;
    }

    await cacheDelPattern('papers:*');
    res.json({ success: true, data: { publishedPdfUrl: pdfBase64 } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Upload failed' });
  }
});

export default router;

