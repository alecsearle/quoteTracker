# quoteTracker
Track business quotes

Schemas:

customerSchema{
  name:
  email:
  phone_number:
  address:
  created_at:
};

quoteSchema{
  customer:
  status:
  total_amount:
  created_at:
  updated_at:
  items: [{QuoteItem]
};

quoteItemSchema{
  quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote', required: true },
  description:
  quantity:
  unit_price:
  total_price:
};

statusSchema{
  status_name:
};

userSchema{
  username:
  password:
  email:
  role:
  created_at:
};
