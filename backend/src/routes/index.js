const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const healthController = require('../controllers/healthController');
const requestController = require('../controllers/requestController');
const adminController = require('../controllers/adminController');
const foodController = require('../controllers/foodController');
const goalController = require('../controllers/goalController');
const workoutController = require('../controllers/workoutController');
const postController = require('../controllers/postController');
const supplementController = require('../controllers/supplementController');
const { auth, authorize } = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getMe);
router.patch('/auth/profile', auth, authController.updateProfile);

// Health Routes
router.post('/health/log', auth, healthController.createLog);
router.get('/health/logs', auth, healthController.getLogs);
router.get('/health/stats', auth, healthController.getStats);

// Food Routes
router.post('/food/log', auth, foodController.createFoodLog);
router.get('/food/logs', auth, foodController.getFoodLogs);
router.delete('/food/logs/:id', auth, foodController.deleteFoodLog);

// Goal Routes
router.post('/goals', auth, goalController.createGoal);
router.get('/goals', auth, goalController.getGoals);
router.patch('/goals/:id/progress', auth, goalController.updateGoalProgress);
router.delete('/goals/:id', auth, goalController.deleteGoal);

// Workout Routes
router.post('/workouts', auth, workoutController.createWorkout);
router.get('/workouts', auth, workoutController.getWorkouts);
router.delete('/workouts/:id', auth, workoutController.deleteWorkout);

// Post Routes
router.post('/posts', auth, postController.createPost);
router.get('/posts', auth, postController.getPosts);
router.patch('/posts/:id/react', auth, postController.reactToPost);

// Request Routes
router.post('/requests', auth, requestController.createRequest);
router.get('/requests/my', auth, requestController.getMyRequests);
router.get('/requests/all', auth, authorize('volunteer', 'admin'), requestController.getAllRequests);
router.patch('/requests/:id/resolve', auth, authorize('volunteer', 'admin'), requestController.resolveRequest);

// Admin Routes
router.get('/admin/stats', auth, authorize('admin'), adminController.getDashboardStats);
router.get('/admin/users', auth, authorize('admin'), adminController.getAllUsers);
router.patch('/admin/users/:id/role', auth, authorize('admin'), adminController.updateUserRole);
router.delete('/admin/users/:id', auth, authorize('admin'), adminController.deleteUser);

// Supplement Routes
router.post('/supplements', auth, supplementController.addSupplement);
router.get('/supplements', auth, supplementController.getSupplements);
router.delete('/supplements/:id', auth, supplementController.deleteSupplement);

module.exports = router;
