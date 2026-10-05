const calendarView = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  MONTHS: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],

  init() {
    const dialog = document.getElementById("syncDialog");
    const close = () => (dialog.hidden = true);

    document.getElementById("moreBtn").addEventListener("click", () => (dialog.hidden = false));
    document.getElementById("syncClose").addEventListener("click", close);
    dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    dialog.querySelectorAll(".sync-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log("Sync calendar with:", btn.dataset.provider);  // real sync needs OAuth, later
        close();
      });
    });

    // middle calendar icon = jump back to today (calendar view only)
    document.getElementById("todayBtn").addEventListener("click", () => {
      if (leaveSummary.view !== "calendar") return;
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth();
      this.render();
    });
  },

  // dir = -1 (previous month) or +1 (next month)
  shift(dir) {
    let y = this.year;
    let m = this.month + dir;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    if (y < mockData.calendar.minYear || y > mockData.calendar.maxYear) return;
    this.year = y;
    this.month = m;
    this.render();
  },

  eventsFor(d, m, y) {
    const dd = String(d).padStart(2, "0");
    const mm = String(m + 1).padStart(2, "0");
    const full = `${dd}-${mm}-${y}`;
    const cal = mockData.calendar;
    const out = [];

    const holiday = cal.dated[full] || cal.fixed[`${dd}-${mm}`];
    if (holiday) out.push({ type: "holiday", name: holiday });

    ["upcoming", "past"].forEach((p) =>
      mockData.agenda[p].forEach((x) => {
        if (x.date === full && x.type === "leave") out.push({ type: "leave", name: x.name });
      })
    );

    mockData.absent.forEach((a) => {
      if (a.date === full) out.push({ type: "absent", name: "Absent" });
    });

    return out;
  },

  render() {
    const { year, month } = this;
    const cal = mockData.calendar;

    document.getElementById("dateRange").textContent = `${this.MONTHS[month]} ${year}`;
    document.getElementById("prevYear").disabled = year === cal.minYear && month === 0;
    document.getElementById("nextYear").disabled = year === cal.maxYear && month === 11;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lead = (new Date(year, month, 1).getDay() + 6) % 7;      // Monday first
    const total = Math.ceil((lead + daysInMonth) / 7) * 7;
    const now = new Date();
    let html = "";

    for (let i = 0; i < total; i++) {
      const d = i - lead + 1;

      if (d < 1 || d > daysInMonth) {
        html += `<div class="cal-cell is-blank"></div>`;
        continue;
      }

      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      const cls = ["cal-cell", i % 7 >= 5 ? "is-weekend" : "", isToday ? "is-today" : ""].join(" ");
      const events = this.eventsFor(d, month, year).map((e) =>
        `<div class="cal-ev cal-ev--${e.type}" title="${e.name}">${e.name}</div>`
      ).join("");

      html += `<div class="${cls}"><span class="cal-cell__num">${d}</span><div class="cal-cell__ev">${events}</div></div>`;
    }

    document.getElementById("calGrid").innerHTML = html;
  }
};