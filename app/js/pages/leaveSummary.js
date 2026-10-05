const leaveSummary = {
  year: new Date().getFullYear(),
  view: "list",
  period: "upcoming",
  kind: "all",

  init() {
    this.renderAll();

    document.getElementById("prevYear").addEventListener("click", () => this.step(-1));
    document.getElementById("nextYear").addEventListener("click", () => this.step(1));

    // list / calendar toggle
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.setView(btn.dataset.view));
    });

    // top Apply Leave button (will open the Zoho Creator form later)
    document.getElementById("applyLeaveBtn").addEventListener("click", () => {
      console.log("Open Apply Leave");
    });

    // leave cards
    document.getElementById("cards").addEventListener("click", (e) => {
      const card = e.target.closest(".leave-card");
      if (!card) return;
      console.log("Open Apply Leave for type:", card.dataset.id);
    });

    // absent rows
    document.getElementById("absentRows").addEventListener("click", (e) => {
      const row = e.target.closest(".absent-row");
      if (!row || !e.target.closest(".btn-outline")) return;
      console.log("Open Apply Leave for date:", row.dataset.date);
    });

    // upcoming / past switch
    document.getElementById("periodSeg").addEventListener("click", (e) => {
      const btn = e.target.closest(".seg__btn");
      if (!btn) return;
      this.period = btn.dataset.period;
      document.querySelectorAll(".seg__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      this.renderAgenda();
    });

    // all / leaves / holidays chips
    document.getElementById("kindChips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      this.kind = chip.dataset.kind;
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
      this.renderAgenda();
    });
  },

  // arrows: change year in list view, month in calendar view
  step(dir) {
    if (this.view === "calendar") {
      calendarView.shift(dir);
    } else {
      this.year += dir;
      this.renderAll();
    }
  },

  setView(view) {
    this.view = view;
    const isCal = view === "calendar";

    document.getElementById("tab-summary").classList.toggle("is-calendar", isCal);
    document.getElementById("listView").hidden = isCal;
    document.getElementById("calendarView").hidden = !isCal;
    document.querySelectorAll(".view-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.view === view)
    );

    if (isCal) {
      calendarView.render();
    } else {
      document.getElementById("prevYear").disabled = false;
      document.getElementById("nextYear").disabled = false;
      this.renderBar();
    }
  },

  renderAll() {
    this.renderBar();
    this.renderCards();
    this.renderAbsent();
    this.renderAgenda();
  },

  renderBar() {
    document.getElementById("leaveBooked").textContent = mockData.summary.leaveBooked;
    document.getElementById("absentDays").textContent = mockData.summary.absentDays + " day(s)";
    document.getElementById("dateRange").textContent = `01-01-${this.year} - 31-12-${this.year}`;
  },

  icon(type, color) {
    if (type === "timer") {
      return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="3"/><path d="M10 3h4M12 3v3"/></svg>`;
    }
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"><path d="M7 13a5 5 0 0 1 10 0"/><path d="M12 4v2M5 7l1.5 1.5M19 7l-1.5 1.5M3 13h2M19 13h2"/><path d="M4 17c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0M4 21c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0"/></svg>`;
  },

  renderCards() {
    const info = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>`;

    document.getElementById("cards").innerHTML = mockData.leaveCards.map((c) => `
      <div class="leave-card" data-id="${c.id}" style="--c:${c.color}; --cbg:${c.bg}">
        <div class="leave-card__top">
          <div class="leave-card__icon">${this.icon(c.icon, c.color)}</div>
          <div class="leave-card__title">${c.name}</div>
        </div>
        <div class="leave-card__big">
          <b class="${c.available > 0 ? "is-green" : ""}">${c.available}</b>
          <span>Available</span>
        </div>
        <div class="leave-card__foot">
          <span>Booked</span>
          <b>${c.booked}</b>
          <i class="leave-card__info">${info}</i>
        </div>
      </div>
    `).join("");
  },

  renderAbsent() {
    const list = mockData.absent;
    const total = list.reduce((sum, a) => sum + a.days, 0);

    document.getElementById("absentTitle").textContent = total + (total === 1 ? " day" : " days");

    document.getElementById("absentRows").innerHTML = list.map((a) => `
      <div class="absent-row" data-date="${a.date}">
        <div class="absent-row__date">${a.date} , ${a.day}</div>
        <div class="absent-row__days">${a.days} ${a.days === 1 ? "day" : "days"}</div>
        <div class="absent-row__action">
          <button class="btn-outline">Apply Leave</button>
        </div>
      </div>
    `).join("");
  },

  renderAgenda() {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const toDate = (s) => { const [d, m, y] = s.split("-"); return new Date(+y, m - 1, +d); };

    let list = mockData.agenda[this.period].filter((x) => this.kind === "all" || x.type === this.kind);

    list = list.slice().sort((a, b) =>
      this.period === "upcoming" ? toDate(a.date) - toDate(b.date) : toDate(b.date) - toDate(a.date));

    const el = document.getElementById("agenda");

    if (!list.length) {
      el.innerHTML = `
        <div class="empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b6bdd1" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15h6"/></svg>
          <p>No data found</p>
        </div>`;
      return;
    }

    el.innerHTML = list.map((x) => {
      const d = toDate(x.date);
      const tag = x.type === "leave"
        ? `Leave · ${x.days} ${x.days === 1 ? "day" : "days"}`
        : "Holiday";
      return `
        <div class="agenda-item agenda-item--${x.type}">
          <div class="date-badge"><b>${String(d.getDate()).padStart(2, "0")}</b><span>${months[d.getMonth()]}</span></div>
          <div class="agenda-item__main">
            <div class="agenda-item__name">${x.name}</div>
            <div class="agenda-item__sub">${days[d.getDay()]} · ${x.date}</div>
          </div>
          <span class="tag tag--${x.type}">${tag}</span>
        </div>`;
    }).join("");
  }
};