const URL = "http://localhost:8080";
Vue.createApp({
  data() {
    return {
      currentPage: "home",
      user: {
        companyName: "",
        email: "",
        password: "",
      },
      currentUser: null,
      newQuote: {
        customerInfo: {
          name: "",
          phoneNumber: "",
          email: "",
          address: "",
        },
        title: "",
        description: "",
        status: "",
        totalAmount: "",
        createdAt: "",
        items: [],
        comments: "",
      },
      newComment: {
        item: "",
        comment: "",
      },
      newItems: [
        {
          title: "",
          description: "",
          quantity: "",
          unitPrice: "",
          totalPrice: "",
        },
      ],
      editingQuote: false,
      quotes: [],

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
    },

    createItem: function () {
      this.newItems.push({
        title: "",
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

      this.newQuote.items = this.newItem;

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.newQuote),
      };
      //make changes here
      let response = await fetch(`${URL}/quotes`, requestOptions);
      if (response.status === 201) {
        this.getQuotes();
        this.currentPage = "home";
        this.clearQuote();
        console.log("successfully created a quote");
      } else {
        console.log("failed to create a quote");
      }
    },
    //
    getQuotes: async function () {
      let response = await fetch(`${URL}/quotes`);
      let data = await response.json();
      this.quotes = data;
      console.log(data);
    },
    //should be good
    clearQuote: function () {
      this.newQuote = {
        title: "",
        description: "",
        status: "",
        totalAmount: "",
        createdAt: "",
        items: [],
        comments: "",
      };
      this.newItem = [
        {
          title: "",
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

      let response = await fetch(`${URL}/quizzes/${quoteId}`, requestOptions);
      if (response.status === 204) {
        this.getQuotes();
      }
    },
    //make changes here
    editQuote: function (quiz) {
      this.newQuiz = quiz;
      this.newQuestions = quiz.questions;
      this.currentPage = "createQuiz";
      this.editingQuiz = true;
    },

    saveQuote: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      this.newQuote.items = this.newItem;

      let requestOptions = {
        method: "PUT",
        header: myHeaders,
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
  },
  computed: {
    balance: function () {
      let total = 0;
      for (let i = 0; i < this.filteredExpenses.length; i++) {
        total += this.filteredExpenses[i].amount;
      }
      return total;
    },
    filteredExpenses: function () {
      return this.expenses.filter((expense) => {
        return (
          "description" in expense &&
          expense.description
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
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
