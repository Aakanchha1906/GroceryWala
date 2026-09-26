const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// ==========================
// GET ALL PRODUCTS
// ==========================

router.get("/", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });

    }

});


// ==========================
// ADD A PRODUCT
// ==========================

router.post("/", async (req, res) => {

    try {

        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    } catch (error) {

        res.status(400).json({
            message: "Failed to add product",
            error: error.message
        });

    }

});


module.exports = router;