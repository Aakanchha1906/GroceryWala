const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    customer: {
        name: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        }
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    subtotal: {
        type: Number,
        required: true
    },

    delivery: {
        type: Number,
        default: 30
    },

    total: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        default: "Cash on Delivery"
    },

    status: {
        type: String,
        default: "Order Placed"
    },

    orderDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Order", orderSchema);