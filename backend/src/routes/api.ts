import { Router } from 'express';
import * as authController from '../controllers/AuthController';
import * as customerController from '../controllers/CustomerController';
import * as noteController from '../controllers/NoteController';
import * as attachmentController from '../controllers/AttachmentController';
import * as chatController from '../controllers/ChatController';
import { authenticateToken } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// --- AUTH ROUTERS ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/users', authenticateToken, authController.getUsers);

// --- CRM CUSTOMER ROUTERS ---
router.get('/customers', authenticateToken, customerController.getCustomers);
router.post('/customers', authenticateToken, customerController.createCustomer);
router.get('/customers/:id', authenticateToken, customerController.getCustomerById);
router.put('/customers/:id', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, customerController.deleteCustomer);

// --- NOTES & MENTIONS ROUTERS ---
router.post('/notes', authenticateToken, noteController.createNote);
router.get('/notes/customer/:customerId', authenticateToken, noteController.getCustomerNotes);

// --- NOTIFICATIONS ROUTERS ---
router.get('/notifications', authenticateToken, noteController.getNotifications);
router.put('/notifications/read-all', authenticateToken, noteController.markAllAsRead);
router.put('/notifications/:id/read', authenticateToken, noteController.markNotificationAsRead);

// --- ATTACHMENTS ROUTERS ---
router.post('/attachments', authenticateToken, upload.single('file'), attachmentController.uploadAttachment);
router.delete('/attachments/:id', authenticateToken, attachmentController.deleteAttachment);

// --- INTERNAL CHAT ROUTERS ---
router.get('/chat/history/:receiverId', authenticateToken, chatController.getChatHistory);

export default router;
