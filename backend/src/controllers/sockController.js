import Sock from '../models/Sock.js';

export const getAllSocks = async (req, res) => {
  try {
    const { color, size, pattern, page = 1, limit = 10 } = req.query;
    const filter = { status: 'available' };

    if (color) filter.color = { $regex: color, $options: 'i' };
    if (size) filter.size = size;
    if (pattern) filter.pattern = { $regex: pattern, $options: 'i' };

    if (req.userId) {
      filter.userId = { $ne: req.userId };
    }

    const skip = (page - 1) * limit;
    const socks = await Sock.find(filter)
      .populate('userId', 'username profilePicture bio')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sock.countDocuments(filter);

    res.json({
      socks,
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

export const getSockById = async (req, res) => {
  try {
    const sock = await Sock.findById(req.params.id).populate(
      'userId',
      'username profilePicture bio'
    );

    if (!sock) {
      return res.status(404).json({ message: 'Sock not found' });
    }

    res.json(sock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSock = async (req, res) => {
  try {
    const { color, pattern, size, material, description, imageUrls } = req.body;
    let images = [];

    // Handle file uploads from multipart
    if (req.files && req.files.length > 0) {
      images = req.files.map((f) => `/uploads/${f.filename}`);
    }
    // Handle image URLs from JSON
    else if (imageUrls && Array.isArray(imageUrls)) {
      images = imageUrls;
    }
    // Handle single image URL string
    else if (imageUrls && typeof imageUrls === 'string') {
      images = [imageUrls];
    }

    const sock = await Sock.create({
      userId: req.userId,
      color,
      pattern,
      size,
      material,
      description,
      images,
    });

    res.status(201).json({
      message: 'Sock created successfully',
      sock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSock = async (req, res) => {
  try {
    const sock = await Sock.findById(req.params.id);

    if (!sock) {
      return res.status(404).json({ message: 'Sock not found' });
    }

    if (sock.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this sock' });
    }

    const { color, pattern, size, material, description } = req.body;

    let images = sock.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    Object.assign(sock, {
      color: color || sock.color,
      pattern: pattern || sock.pattern,
      size: size || sock.size,
      material: material || sock.material,
      description: description !== undefined ? description : sock.description,
      images,
    });

    await sock.save();
    res.json({ message: 'Sock updated successfully', sock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSock = async (req, res) => {
  try {
    const sock = await Sock.findById(req.params.id);

    if (!sock) {
      return res.status(404).json({ message: 'Sock not found' });
    }

    if (sock.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this sock' });
    }

    await Sock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sock deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserSocks = async (req, res) => {
  try {
    const socks = await Sock.find({ userId: req.userId });
    res.json(socks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
