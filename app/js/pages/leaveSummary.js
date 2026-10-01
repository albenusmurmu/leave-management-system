const leaveSummary = {
  year: new Date().getFullYear(),

  init() {
    this.renderBar();
    this.renderCards();
    this.renderAbsent();

    document.getElementById("prevYear").addEventListener("click", () => {
      this.year--;
      this.renderBar();
      this.renderCards();
       this.renderAbsent();
    });

    document.getElementById("applyLeaveBtn").addEventListener("click", () => {
      applyLeave.open();
    });

    document.getElementById("nextYear").addEventListener("click", () => {
      this.year++;
      this.renderBar();
      this.renderCards();
       this.renderAbsent();
    });

    // list / calendar view toggle (visual only for now)
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });

    // clicking a card will open the Apply Leave form (built later)
    document.getElementById("cards").addEventListener("click", (e) => {
      const card = e.target.closest(".leave-card");
      if (!card) return;
      // console.log("Open Apply Leave form with type:", card.dataset.id);
       applyLeave.open({ typeId: card.dataset.id });
    });

      document.getElementById("absentRows").addEventListener("click", (e) => {
      const row = e.target.closest(".absent-row");
      if (!row || !e.target.closest(".btn-outline")) return;
      // console.log("Open Apply Leave form for date:", row.dataset.date);
      applyLeave.open({ date: row.dataset.date });
    });
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
    // sun over water
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"><path d="M7 13a5 5 0 0 1 10 0"/><path d="M12 4v2M5 7l1.5 1.5M19 7l-1.5 1.5M3 13h2M19 13h2"/><path d="M4 17c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0M4 21c2-1.5 3-1.5 5 0s3 1.5 5 0 3-1.5 5 0"/></svg>`;
  },

  renderCards() {
    const info = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>`;

    document.getElementById("cards").innerHTML = mockData.leaveCards.map((c) => `
      <div class="leave-card" data-id="${c.id}" style="--c:${c.color}; --cbg:${c.bg}">
        <div class="leave-card__title">${c.name}</div>
        <div class="leave-card__icon" style="background:${c.bg}">${this.icon(c.icon, c.color)}</div>
        <div class="leave-card__rows">
          <div class="leave-card__row">
            <span>Available</span>
            <b class="${c.available > 0 ? "is-green" : ""}">${c.available}</b>
          </div>
          <div class="leave-card__row">
            <span>Booked</span>
            <b>${c.booked}</b>
            <i class="leave-card__info">${info}</i>
          </div>
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
  }
};