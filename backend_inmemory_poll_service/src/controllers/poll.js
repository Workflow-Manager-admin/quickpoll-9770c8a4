const pollService = require('../services/poll');

// PUBLIC_INTERFACE
exports.createPoll = (req, res) => {
  /** Create a new poll */
  try {
    const { question, options } = req.body;
    const poll = pollService.createPoll(question, options);
    res.status(201).json({ poll });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
exports.listPolls = (req, res) => {
  /** List all active polls (without showing votes) */
  res.json({ polls: pollService.listPolls() });
};

// PUBLIC_INTERFACE
exports.getPoll = (req, res) => {
  /** Get the full poll details, including results */
  const pollId = req.params.id;
  const poll = pollService.getFullPoll(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
  } else {
    res.json({ poll });
  }
};

// PUBLIC_INTERFACE
exports.vote = (req, res) => {
  /** Vote for a poll option by index */
  const pollId = req.params.id;
  const { optionIndex } = req.body;
  try {
    const updated = pollService.vote(pollId, optionIndex);
    res.json({ poll: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
exports.closePoll = (req, res) => {
  /** Close a poll */
  const pollId = req.params.id;
  const poll = pollService.closePoll(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
  } else {
    res.json({ poll });
  }
};

// PUBLIC_INTERFACE
exports.wsHandler = (ws, req) => {
  /** Handle new WebSocket connection for poll live updates */
  // Register
  const sendFunc = (msg) => {
    try { ws.send(msg); } catch {}
  };
  pollService.addWSClient(sendFunc);

  ws.on('close', () => {
    pollService.removeWSClient(sendFunc);
  });
  ws.on('error', () => {
    pollService.removeWSClient(sendFunc);
  });
};
