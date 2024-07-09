const URL = "http://localhost:8080";
Vue.createApp({
  data() {
    return {
      currentPage: "login",
      user: {
        name: "",
        email: "",
        password: "",
      },
      currentUser: null,
      newQuiz: {
        title: "",
        description: "",
        questions: [],
      },

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
  },
  created: function () {
    console.log("created");
    this.getSession();
  },
})
  .use(Vuetify.createVuetify())
  .mount("#app");
