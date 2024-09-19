import CloudDashboard from "./CloudDashboard";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  const app = new CloudDashboard(root);

  app.init();
});
