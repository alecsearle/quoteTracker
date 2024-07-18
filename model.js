const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

mongoose.connect(process.env.DBPASSWORD);

const QuoteSchema = Schema(
  {
    customer: {
      name: {
        type: String,
        required: [true, "Customer must have a name."],
      },
      email: {
        type: String,
        required: [true, "Customer must have an email."],
      },
      phone: {
        type: String,
        required: [true, "Customer must have a phone number."],
      },
      address: {
        type: String,
        required: [true, "Customer must have an address."],
      },
    },
    // status: {
    //   type: String,
    //   required: [true, "Quote must have a status."],
    //   enum: ["Pending", "Accepted", "Rejected"],
    // },
    // payQuote: {
    //   type: Boolean,
    //   required: [true, "Quote must have a payment status."],
    //   enum: ["Paid", "Unpaid"],
    // },

    title: {
      type: String,
      required: [true, "Quote must have a title."],
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      required: [true, "Quote must have a status"],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Quote must have an owner."],
    },
    items: [
      {
        name: {
          type: String,
          required: [true, "Quote item must have a name."],
        },
        description: {
          type: String,
        },
        quantity: {
          type: Number,
          required: [true, "Quote item must have a quantity."],
        },
        unitPrice: {
          type: Number,
          required: [true, "Quote item must have a price."],
        },
        totalPrice: {
          type: Number,
          required: [true, "Quote item must have a total price."],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Quote must have a total amount."],
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const companySchema = Schema({
  companyName: {
    type: String,
    required: [true, "Company must have a name."],
  },
  email: {
    type: String,
    required: [true, "Company must have an email."],
  },
  password: {
    type: String,
    required: [true, "Company must have a password."],
  },
});

companySchema.methods.setPassword = async function (plainPassword) {
  try {
    const encryptedPassword = await bcrypt.hash(plainPassword, 10);
    this.password = encryptedPassword;
  } catch (error) {
    console.log("Invalid password, can't set password");
  }
};
companySchema.methods.verifyPassword = async function (plainPassword) {
  let isOkay = await bcrypt.compare(plainPassword, this.password);
  return isOkay;
};

const Quote = mongoose.model("Quote", QuoteSchema);
const Company = mongoose.model("Company", companySchema);

module.exports = {
  Quote,
  Company,
};
