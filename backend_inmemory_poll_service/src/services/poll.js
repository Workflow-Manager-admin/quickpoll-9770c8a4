const { v4: uuidv4 } = require('uuid');

class PollService {
  constructor() {
    /** @type {Map<string, { id: string, question: string, options: string[], votes: number[], createdAt: Date, closed: boolean }>} */
    this.polls = new Map();
    /** @type {Set<function>} */
    this.wsClients = new Set();
  }

  // PUBLIC_INTERFACE
  createPoll(question, options) {
    /** This method creates a new poll with the specified question and options */
    if (
      typeof question !== 'string' ||
      !Array.isArray(options) ||
      options.length < 2 ||
      !options.every((o) => typeof o === 'string' && o.trim().length > 0)
    ) {
      throw new Error('Invalid poll data');
    }
    const id = uuidv4();
    const poll = {
      id,
      question,
      options,
      votes: Array(options.length).fill(0),
      createdAt: new Date(),
      closed: false,
    };
    this.polls.set(id, poll);
    this.notifyClients({ type: 'NEW_POLL', poll: this.stripResults(poll) });
    return poll;
  }

  // PUBLIC_INTERFACE
  listPolls() {
    /** Returns an array of active polls without vote results (for listing) */
    return Array.from(this.polls.values())
      .filter(poll => !poll.closed)
      .map(this.stripResults);
  }

  // PUBLIC_INTERFACE
  getFullPoll(pollId) {
    /** Returns complete poll info with votes for results */
    const poll = this.polls.get(pollId);
    if (!poll) return null;
    return { ...poll };
  }

  // PUBLIC_INTERFACE
  vote(pollId, optionIndex) {
    /** Registers a vote for the specified option on the given poll */
    const poll = this.polls.get(pollId);
    if (!poll || poll.closed) {
      throw new Error('Poll not found or closed');
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new Error('Invalid option');
    }
    poll.votes[optionIndex]++;
    // Notify WS clients about results update
    this.notifyClients({ type: 'VOTE', pollId, results: poll.votes });
    return { ...poll };
  }

  // PUBLIC_INTERFACE
  closePoll(pollId) {
    /** Closes the poll to further voting */
    const poll = this.polls.get(pollId);
    if (poll && !poll.closed) {
      poll.closed = true;
      this.notifyClients({ type: 'CLOSED', pollId });
    }
    return poll ? { ...poll } : null;
  }

  // For WebSocket live update subscription
  // PUBLIC_INTERFACE
  addWSClient(sendFunc) {
    /** Registers a WebSocket client send function for real-time updates. */
    this.wsClients.add(sendFunc);
  }
  // PUBLIC_INTERFACE
  removeWSClient(sendFunc) {
    /** Deregisters a WebSocket client send function */
    this.wsClients.delete(sendFunc);
  }

  /**
   * Notifies all WebSocket clients with an update
   * @param {object} message
   */
  notifyClients(message) {
    for (const send of this.wsClients) {
      try {
        send(JSON.stringify(message));
      } catch (e) {
        // Remove dead clients on failure
        this.wsClients.delete(send);
      }
    }
  }

  stripResults(poll) {
    // Return poll data without the votes array (for list/sharing)
    const { votes, ...rest } = poll;
    return rest;
  }
}

module.exports = new PollService();
