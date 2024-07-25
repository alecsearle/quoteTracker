const URL = "http://localhost:8080";

Vue.createApp({
  data() {
    return {
      currentPage: "newQuote",
      user: {
        companyName: "",
        email: "",
        password: "",
      },
      currentUser: null,
      currentQuote: {},
      newQuote: {
        id: "",
        customer: {
          name: "",
          email: "",
          phone: "",
          address: "",
        },
        title: "",
        description: "",
        status: "",
        createdAt: "",
        items: [],
        totalAmount: "",
        comment: "",
      },
      newComment: {
        item: "",
        comment: "",
      },
      newItems: [
        {
          name: "",
          description: "",
          quantity: "",
          unitPrice: "",
          totalPrice: "",
        },
      ],
      searchInput: "",
      editingQuote: false,
      quotes: [],
      deletedQuotes: [],

      // vuetify rules //
      companyNameRules: [
        (value) => {
          if (value?.length > 3) return true;

          return "First name must be at least 3 characters.";
        },
      ],
    };
  },
  methods: {
    setPage: function (page) {
      this.currentPage = page;
      console.log("on " + this.currentPage + " page");
    },

    sendMail: function (data) {
      let tempParams = {
        company_name: this.currentUser.companyName,
        customer_name: data.customer.name,
        customer_email: data.customer.email,
        quote_id: data._id,
      };
      console.log("before sending", this.quotes[0]._id);
      emailjs
        .send("service_mailtrap", "template_9ovot2h", tempParams)
        .then((res) => {
          // Use arrow function here
          console.log("success", res.status);
          console.log("after sending", this.quotes[0]._id);
        });
    },

    createItem: function () {
      this.newItems.push({
        name: "",
        description: "",
        quantity: "",
        unitPrice: "",
        totalPrice: "",
      });
    },

    deleteItem: function (index) {
      this.newItems.splice(index, 1);
    },

    registerUser: async function () {
      console.log("registeration initiated");
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };
      let response = await fetch(`${URL}/company`, requestOptions);
      if (response.status === 201) {
        console.log("successfully registered");
        this.loginUser();
      } else {
        console.log("failed to register");
      }
    },

    loginUser: async function () {
      console.log("login initiated");
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };
      let response = await fetch(`${URL}/session`, requestOptions);
      let data = await response.json();
      if (response.status === 201) {
        console.log("successfully logged in");
        this.currentUser = data;
        this.user = {
          companyName: "",
          email: "",
          password: "",
        };
        this.getQuotes();
        this.currentPage = "home";
      } else {
        console.log("failed to log in");
      }
    },
    getSession: async function () {
      let response = await fetch(`${URL}/session`);

      if (response.status === 200) {
        let data = await response.json();
        this.currentUser = data;
        this.getQuotes();
        this.currentPage = "home";
      } else {
        this.currentPage = "login";
      }
    },
    deleteSession: async function () {
      let requestOptions = {
        method: "DELETE",
      };
      let response = await fetch(`${URL}/session`, requestOptions);
      if (response.status === 204) {
        this.currentPage = "login";
        this.currentUser = null;
      }
    },

    createQuote: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      this.newQuote.items = this.newItems;

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.newQuote),
      };
      //make changes here
      let response = await fetch(`${URL}/quotes`, requestOptions);
      if (response.status === 201) {
        let data = await response.json();
        console.log(data);
        this.getQuotes();
        this.currentPage = "home";
        this.clearQuote();
        console.log("successfully created a quote");
        console.log("id BEFORE calling sendMail()", this.quotes[0]._id);
        // this.saveQuote();
        // this.sendMail(data);
        //make sure to uncomment this out
      } else {
        console.log("failed to create a quote");
      }
    },

    //ALL CUSTOMER QUOTES
    getQuotes: async function () {
      console.log("fetching quotes");
      let response = await fetch(`${URL}/quotes`);
      let data = await response.json();
      this.quotes = data.reverse();
      console.log(data);
    },

    // SINGLE CUSTOMER QUOTE
    getQuote: async function (quoteID) {
      let res = await fetch(`${URL}/quotes/${quoteID}`);
      let data = await res.json();
      console.log(data);
      this.currentQuote = data[0];
      this.currentPage = "customerQuote";
    },
    //should be good
    clearQuote: function () {
      this.newQuote = {
        customer: {
          name: "",
          email: "",
          phone: "",
          address: "",
        },
        title: "",
        description: "",
        status: "",
        totalAmount: "",
        createdAt: "",
        items: [],
        comment: "",
      };
      this.newItems = [
        {
          name: "",
          description: "",
          quantity: "",
          unitPrice: "",
          totalPrice: "",
        },
      ];
      this.newComment = {
        item: "",
        comment: "",
      };

      this.editingQuote = false;
    },
    //quotes id quote quizzes
    deleteQuote: async function (quoteId) {
      let requestOptions = {
        method: "DELETE",
      };

      let response = await fetch(`${URL}/quotes/${quoteId}`, requestOptions);
      if (response.status === 204) {
        this.getQuotes();
      }
    },
    //make changes here
    editQuote: function (quote) {
      console.log(this.currentQuote);
      this.newQuote = quote;
      this.newItems = quote.items;
      this.currentPage = "editPage";
      this.editingQuote = true;
    },

    saveQuote: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log(myHeaders);

      this.newQuote.items = this.newItems;
      console.log(this.newQuote);
      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(this.newQuote),
      };

      let response = await fetch(
        `${URL}/quotes/${this.newQuote._id}`,
        requestOptions
      );
      if (response.status === 204) {
        this.getQuotes();
        this.clearQuote();
        this.currentPage = "home";
      } else {
        console.log("failed to update quote");
      }
    },
    editOff: function () {
      this.editingQuote = false;
      this.clearQuote();
    },
    calculateTotalPrice: function (item) {
      if (item.quantity && item.unitPrice) {
        item.totalPrice = item.quantity * item.unitPrice;
      } else {
        item.totalPrice = 0;
      }
    },
    calculateTotalAmount: function () {
      let totalAmount = 0;
      this.newItems.forEach((item) => {
        totalAmount += item.totalPrice;
      });
      this.newQuote.totalAmount = totalAmount;
    },
  },
  computed: {
    filteredQuotes: function () {
      return this.quotes.filter((quote) => {
        return (
          quote.title.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          quote.customer.name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          quote.customer.phone
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          quote.customer.email
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          quote.description
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          quote._id.toLowerCase().includes(this.searchInput.toLowerCase())
        );
      });
    },
  },

  created: function () {
    console.log("created");
    this.getSession();
  },
})
  .use(Vuetify.createVuetify())
  .mount("#app");
