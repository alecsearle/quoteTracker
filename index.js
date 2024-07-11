const express = require("express");
const cors = require("cors");
const model = require("./model");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, origin);
    },
  })
);

app.use(
  session({
    secret: "ngjuhguirtsgjigdsfoiunjg",
    saveUninitialized: true,
    resave: false,
  })
);

async function AuthMiddleware(req, res, next) {
  if (req.session && req.session.companyID) {
    let company = await model.Company.findOne({ _id: req.session.companyID });
    if (!company) {
      return res.status(401).send("Unauthenticated.");
    }
    req.company = company;
    next();
  } else {
    res.status(401).send("Unauthenticated.");
  }
}

//signing up
app.get("/company", async function (req, res) {
  try {
    let companies = await model.Company.find({}, { password: 0 });
    res.send(companies);
  } catch (error) {
    res.status(404).send("No companies found.");
  }
});

app.post("/company", async function (req, res) {
  try {
    let newCompany = new model.Company({
      companyName: req.body.companyName,
      email: req.body.email,
      password: req.body.password,
    });
    await newCompany.setPassword(req.body.password);
    const errors = newCompany.validateSync();
    if (errors) {
      return res.status(422).send(errors);
    }
    await newCompany.save();
    res.status(201).send("succesfully registered");
  } catch (error) {
    res.status(500).send("bad request.");
  }
});

app.get("/session", AuthMiddleware, async function (req, res) {
  res.send(req.session);
});

//logging in
app.post("/session", async function (req, res) {
  try {
    let company = await model.Company.findOne({ email: req.body.email });
    if (!company) {
      return res.status(401).send("Authentication failure.");
    }
    console.log(company);
    let isGoodPassword = await company.verifyPassword(req.body.password);
    if (!isGoodPassword) {
      return res.status(401).send("Authentication failure.");
    }
    req.session.companyID = company._id;
    req.session.companyName = company.companyName;
    res.status(201).send(req.session);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error.");
  }
});

//logging out
app.delete("/session", async function (req, res) {
  //   req.session.companyID = undefined;
  req.session = null;
  res.status(204).send("Logged out.");
});

//get a quote
app.get("/quotes", async function (req, res) {
  try {
    let quotes = await model.Quote.find();
    if (!quotes) {
      return res.status(404).send("No quotes found.");
    }
    res.json(quotes);
  } catch (error) {
    res.status(404).send("No quotes found.");
  }
});

//add a quotes
app.post("/quotes", async function (req, res) {
  try {
    let newQuote = new model.Quote({
      customer: req.body.customerInfo,
      title: req.body.title,
      description: req.body.description,
      owner: req.session.companyID,
      items: req.body.items,
      total_amount: req.body.totalAmount,
      comment: req.body.comment,
    });
    const errors = newQuote.validateSync();
    if (errors) {
      return res.status(422).send(errors);
    }
    await newQuote.populate("owner", "companyName");
    await newQuote.save();
    res.status(201).send("Quote created.");
  } catch (error) {
    res.status(500).send("Bad request.");
    console.log(error);
  }
});

//get a quote by id
app.get("/quotes/:quoteID", async function (req, res) {
  try {
    let quote = await model.Quote.find({ _id: req.params.quoteID });
    if (!quote) {
      return res.status(404).send("No quote found.");
    }
    res.json(quote);
  } catch (error) {
    res.status(400).send("Bad request.");
  }
});

//delete a quote
app.delete("/quotes/:quoteID", AuthMiddleware, async function (req, res) {
  try {
    let isDeleted = await model.Quote.findOneAndDelete({
      _id: req.params.quoteID,
      owner: req.session.companyID,
    });
    if (!isDeleted) {
      return res.status(404).send("Quote not found.");
    }
    res.status(204).send("Quote deleted.");
  } catch (error) {
    res.status(500).send("Bad request.");
  }
});

//update a quote/edit a quote

app.put("/quotes/:quoteID", AuthMiddleware, async function (req, res) {
  try {
    let quote = await model.Quote.findOne({
      _id: req.params.quoteID,
      owner: req.session.companyID,
    }).populate("owner", "companyName");
    if (!quote) {
      return res.status(404).send("Quote not found.");
    }
    if (req.session.companyID !== quote.owner._id.toString()) {
      return res.status(403).send("Forbidden.");
    }
    quote.customer = req.body.customer;
    quote.title = req.body.title;
    quote.items = req.body.items;
    quote.total_amount = req.body.total_amount;

    const errors = await quote.validateSync();
    if (errors) {
      return res.status(422).send(errors);
    }
    await quote.save();
    res.status(200).send("Quote updated.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Bad request.");
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
