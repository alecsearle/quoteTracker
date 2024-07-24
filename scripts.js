let canvasElement = document.getElementById("incomeChart");
let config = {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Quoted Income",
        data: [
          1000, 25000, 500, 40000, 30000, 27000, 1000, 25000, 500, 40000, 30000,
          27000,
        ],
      },
    ],
  },
};

let incomeChart = new Chart(canvasElement, config);
