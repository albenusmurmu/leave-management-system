const leaveSummary = {
  year: new Date().getFullYear(),

  init() {
    this.renderBar();

    document.getElementById("prevYear").addEventListener("click", () => {
      this.year--;
      this.renderBar();
    });

    document.getElementById("nextYear").addEventListener("click", () => {
      this.year++;
      this.renderBar();
    });

    // list / calendar view toggle (visual only for now)
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  },

  renderBar() {
    document.getElementById("leaveBooked").textContent = mockData.summary.leaveBooked;
    document.getElementById("absentDays").textContent = mockData.summary.absentDays + " day(s)";
    document.getElementById("dateRange").textContent =
      `01-01-${this.year} - 31-12-${this.year}`;
  }
};