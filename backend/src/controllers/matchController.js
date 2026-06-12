import Match from '../models/Match.js';
import Sock from '../models/Sock.js';

export const getUserMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1Id: req.userId }, { user2Id: req.userId }],
    })
      .populate('sock1Id')
      .populate('sock2Id')
      .populate('user1Id', 'username profilePicture')
      .populate('user2Id', 'username profilePicture');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMatch = async (req, res) => {
  try {
    const { sock2Id } = req.body;

    const sock1 = await Sock.findOne({ userId: req.userId, status: 'available' });
    if (!sock1) {
      return res.status(400).json({ message: 'You must have at least one available sock' });
    }

    const sock2 = await Sock.findById(sock2Id);
    if (!sock2) {
      return res.status(404).json({ message: 'Sock not found' });
    }

    if (sock2.userId.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot match with your own sock' });
    }

    const existingMatch = await Match.findOne({
      $or: [
        { sock1Id: sock1._id, sock2Id: sock2._id },
        { sock1Id: sock2._id, sock2Id: sock1._id },
      ],
    });

    if (existingMatch) {
      return res.status(400).json({ message: 'Match already exists' });
    }

    const match = await Match.create({
      sock1Id: sock1._id,
      sock2Id: sock2._id,
      user1Id: req.userId,
      user2Id: sock2.userId,
    });

    await match.populate('sock1Id sock2Id user1Id user2Id');

    res.status(201).json({
      message: 'Match created successfully',
      match,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.user2Id.toString() !== req.userId && match.user1Id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = 'accepted';
    match.matchedAt = new Date();
    await match.save();

    await Sock.findByIdAndUpdate(match.sock1Id, { status: 'matched' });
    await Sock.findByIdAndUpdate(match.sock2Id, { status: 'matched' });

    res.json({ message: 'Match accepted', match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.user2Id.toString() !== req.userId && match.user1Id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = 'rejected';
    await match.save();

    res.json({ message: 'Match rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unmatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.user1Id.toString() !== req.userId && match.user2Id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Match.findByIdAndDelete(req.params.id);

    await Sock.findByIdAndUpdate(match.sock1Id, { status: 'available' });
    await Sock.findByIdAndUpdate(match.sock2Id, { status: 'available' });

    res.json({ message: 'Unmatched successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
