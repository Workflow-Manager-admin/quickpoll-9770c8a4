const express = require('express');
const healthController = require('../controllers/health');
const pollRoutes = require('./poll');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Poll API routes
router.use('/', pollRoutes);

// Informational endpoint for WebSocket usage
/**
 * @swagger
 * /ws-info:
 *   get:
 *     summary: Get WebSocket connection instructions for poll result live updates
 *     tags: [WebSocket]
 *     responses:
 *       200:
 *         description: Usage notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: string
 */
router.get('/ws-info', (req, res) => {
  res.json({
    info: `Connect via WebSocket to ws://${req.get('host')}/polls/live for real-time poll updates`
  });
});

module.exports = router;
