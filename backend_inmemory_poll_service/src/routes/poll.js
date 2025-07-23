const express = require('express');
const pollController = require('../controllers/poll');

const router = express.Router();

/**
 * @swagger
 * /polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     requestBody:
 *       required: true
 *       description: Poll creation payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The poll question
 *               options:
 *                 type: array
 *                 description: Array of poll option strings (minimum 2)
 *                 items:
 *                   type: string
 *             required: [question, options]
 *     responses:
 *       201:
 *         description: The created poll
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 poll:
 *                   $ref: '#/components/schemas/Poll'
 */
router.post('/polls', pollController.createPoll);

/**
 * @swagger
 * /polls:
 *   get:
 *     summary: List active polls (no votes/results)
 *     tags: [Polls]
 *     responses:
 *       200:
 *         description: List of polls
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 polls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Poll'
 */
router.get('/polls', pollController.listPolls);

/**
 * @swagger
 * /polls/{id}:
 *   get:
 *     summary: Get a poll (with results)
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll with all details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 poll:
 *                   $ref: '#/components/schemas/PollWithVotes'
 *       404:
 *         description: Not found
 */
router.get('/polls/:id', pollController.getPoll);

/**
 * @swagger
 * /polls/{id}/vote:
 *   post:
 *     summary: Submit a vote to a poll
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               optionIndex:
 *                 type: integer
 *                 description: The index of the chosen option (0-based)
 *             required: [optionIndex]
 *     responses:
 *       200:
 *         description: Updated poll
 *       400:
 *         description: Invalid vote
 */
router.post('/polls/:id/vote', pollController.vote);

/**
 * @swagger
 * /polls/{id}/close:
 *   post:
 *     summary: Close a poll
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll closed
 *       404:
 *         description: Not found
 */
router.post('/polls/:id/close', pollController.closePoll);

module.exports = router;
