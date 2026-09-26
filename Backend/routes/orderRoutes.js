const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// CREATE NEW ORDER
router.post("/", async (req, res) => {

    try {

        const order = new Order(req.body);

        const savedOrder =
            await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {

        res.status(400).json({
            message: "Failed to place order",
            error: error.message
        });

    }

});

module.exports = router;