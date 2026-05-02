const Service = require("../models/Service");

// GET all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// GET service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// POST create new service
const createService = async (req, res) => {
  try {
    const { name, category, price, discountPrice, description, features, icon } = req.body;

    const service = await new Service({
      name,
      category,
      price,
      discountPrice,
      description,
      features,
      icon: icon || "sparkles-outline",
    }).save();

    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// PUT update service
const updateService = async (req, res) => {
  try {
    const { name, category, price, discountPrice, description, features, icon } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    if (name) service.name = name;
    if (category) service.category = category;
    if (price) service.price = price;
    if (discountPrice !== undefined) service.discountPrice = discountPrice;
    if (description) service.description = description;
    if (features) service.features = features;
    if (icon) service.icon = icon;

    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await service.deleteOne();
    res.json({ msg: "Service removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
