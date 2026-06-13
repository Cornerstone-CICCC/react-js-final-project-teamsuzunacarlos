import Message from '../models/Message.js';
import Match from '../models/Match.js';

export const getConversation = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (
      match.user1Id.toString() !== req.userId &&
      match.user2Id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const skip = (page - 1) * limit;
    const messages = await Message.find({ matchId })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ matchId });

    res.json({
      messages: messages.reverse(),
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllConversations = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1Id: req.userId }, { user2Id: req.userId }],
      status: 'accepted',
    })
      .populate('sock1Id')
      .populate('sock2Id')
      .populate('user1Id', 'username profilePicture')
      .populate('user2Id', 'username profilePicture')
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      matches.map(async (match) => {
        const lastMessage = await Message.findOne({ matchId: match._id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          match,
          lastMessage,
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { matchId, messageText } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (
      match.user1Id.toString() !== req.userId &&
      match.user2Id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const receiverId =
      match.user1Id.toString() === req.userId ? match.user2Id : match.user1Id;

    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      matchId,
      messageText,
    });

    await message.populate('senderId', 'username profilePicture');

    res.status(201).json({
      message: 'Message sent',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
