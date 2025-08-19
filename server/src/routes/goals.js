const express = require('express');
const { verifyToken } = require('../middleware/auth');
const goalController = require('../controllers/goalController');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get('/', goalController.getUserGoals);
router.post('/', goalController.createGoal);
router.put('/:goalId', goalController.updateGoal);
router.post('/:goalId/complete', goalController.markGoalComplete);
router.delete('/:goalId', goalController.deleteGoal);

module.exports = router;
