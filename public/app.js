const URL = "http://localhost:8080";
Vue.createApp({
  data() {
    return {
      currentPage: "home",
      user: {
        name: "",
        email: "",
        password: "",
      },
      currentUser: null,
      newQuote: {
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
      newItem: [
        {
          title: "",
          description: "",
          quantity: "",
          unitPrice: "",
          totalPrice: "",
        },
      ],
      editingQuote: false,
      quotes: [
        {
          title: "Sauls House",
          description: "Filthy house needs everything done",
          status: "in-progress",
          totalAmount: "10g's",
          createdAt: "9:00",
          items: [
            {
              title: "vaccum",
              description: "sucks stuff",
              quantity: "4",
              unitPrice: "250",
              totalPrice: "1000",
            },
            {
              title: "bleach",
              description: "clean",
              quantity: "3",
              unitPrice: "10",
              totalPrice: "30",
            },
          ],
          comments: "QUOTE",
        },
        {
          title: "Sauls House",
          description: "Filthy house needs everything done",
          status: "in-progress",
          totalAmount: "10g's",
          createdAt: "9:00",
          items: [
            {
              title: "vaccum",
              description: "sucks stuff",
              quantity: "4",
              unitPrice: "250",
              totalPrice: "1000",
            },
            {
              title: "bleach",
              description: "clean",
              quantity: "3",
              unitPrice: "10",
              totalPrice: "30",
            },
          ],
          comments: "QUOTE",
        },
      ],

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
    registerUser: async function () {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };

      let response = await fetch(`${URL}/users`, requestOptions);
      if (response.status === 201) {
        console.log("successfully registered");
        this.loginUser();
      } else {
        console.log("failed to register");
      }
    },

    loginUser: async function () {
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
          name: "",
          email: "",
          password: "",
        };
        this.getQuizzes();
        this.currentPage = "quizzes";
      } else {
        console.log("failed to log in");
      }
    },
    getSession: async function () {
      let response = await fetch(`${URL}/session`);

      if (response.status === 200) {
        let data = await response.json();
        this.currentUser = data;
        this.getQuizzes();
        this.currentPage = "quizzes";
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
      let response = await fetch(`${URL}/quizzes`, requestOptions);
      if (response.status === 201) {
        this.getQuotes();
        this.currentPage = "quizzes";
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
    deleteQuote: async function (quizId) {
      let requestOptions = {
        method: "DELETE",
      };

      let response = await fetch(`${URL}/quizzes/${quizId}`, requestOptions);
      if (response.status === 204) {
        this.getQuotes();
      }
    },

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
        `${URL}/quizzes/${this.newQuiz._id}`,
        requestOptions
      );
      if (response.status === 204) {
        this.getQuotes();
        this.clearQuote();
        this.currentPage = "quizzes";
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
