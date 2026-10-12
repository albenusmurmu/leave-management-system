const applyLeave = {
  els: {},
  typeId: "",
  toastTimer: null,
  calEl: null,
  cal: { which: "from", year: 0, month: 0 },
  MONTHS: ["January","February","March","April","May","June","July","August","September","October","November","December"],

  init() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      modal: $("applyModal"), card: $("applyCard"),
      badge: $("apBadge"), title: $("apTitle"), chip: $("apChip"),
      box: $("typeBox"), btn: $("typeBtn"), label: $("typeLabel"),
      search: $("typeSearch"), list: $("typeList"),
      from: $("fFrom"), to: $("fTo"), fromPicker: $("fFromPicker"), toPicker: $("fToPicker"),
      days: $("apDays"), email: $("fEmail"), reason: $("fReason"), count: $("apCount"),
      errType: $("errType"), errDate: $("errDate"), errEmail: $("errEmail"),
      toast: $("toast")
    };
    const e = this.els;

    $("applyClose").addEventListener("click", () => this.close());
    $("applyCancel").addEventListener("click", () => this.close());
    $("applySubmit").addEventListener("click", () => this.submit());

    // custom searchable dropdown
    e.btn.addEventListener("click", () => this.toggleList());
    e.search.addEventListener("input", () => this.renderList());
    e.list.addEventListener("click", (ev) => {
      const item = ev.target.closest(".ap-opt");
      if (!item) return;
      this.setType(item.dataset.id);
      this.toggleList(false);
    });
    document.addEventListener("click", (ev) => {
      if (!e.box.contains(ev.target)) this.toggleList(false);
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape" || e.modal.hidden) return;
      if (!this.calEl.hidden) { this.closeCal(); return; }
      if (e.box.classList.contains("is-open")) this.toggleList(false);
      else this.close();
    });

    // custom calendar (the browser's native picker is blocked inside Creator's iframe)
    this.calEl = document.createElement("div");
    this.calEl.className = "ap-cal";
    this.calEl.hidden = true;
    this.calEl.addEventListener("click", (ev) => this.onCalClick(ev));

    document.querySelectorAll(".ap-date").forEach((field, i) => {
      const which = i === 0 ? "from" : "to";
      const open = (ev) => { ev.stopPropagation(); this.openCal(which, field); };
      field.querySelector("input[type=text]").addEventListener("click", open);
      field.querySelector(".ap-date__btn").addEventListener("click", open);
    });
    document.addEventListener("click", (ev) => {
      if (!ev.target.closest(".ap-cal")) this.closeCal();
    });

    e.reason.addEventListener("input", () => {
      e.count.textContent = `${e.reason.value.length}/250`;
    });
  },

  // dd-MM-yyyy <-> yyyy-MM-dd
  toISO(d)     { const [dd, mm, yy] = d.split("-"); return `${yy}-${mm}-${dd}`; },
  toDisplay(i) { const [yy, mm, dd] = i.split("-"); return `${dd}-${mm}-${yy}`; },
  isoOf(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  setDate(which, iso) {
    const e = this.els;
    (which === "from" ? e.from : e.to).value = iso ? this.toDisplay(iso) : "";
    (which === "from" ? e.fromPicker : e.toPicker).value = iso || "";
  },

  // typeId: pre-select a leave type.  date: "dd-MM-yyyy" pre-fills both dates.
  open({ typeId = "", date = "" } = {}) {
    const e = this.els;
    this.setType(typeId);

    const iso = date ? this.toISO(date) : "";
    this.setDate("from", iso);
    this.setDate("to", iso);

    e.email.value = "";
    e.reason.value = "";
    e.count.textContent = "0/250";
    this.clearErrors();
    this.updateDays();
    this.toggleList(false);
    this.closeCal();

    e.modal.hidden = false;
  },

  close() {
    this.closeCal();
    this.els.modal.hidden = true;
  },

  // ---------- custom calendar ----------
  openCal(which, field) {
    const e = this.els;
    const own = (which === "from" ? e.fromPicker : e.toPicker).value;
    const base = own || e.fromPicker.value;
    const d = base ? new Date(base + "T00:00:00") : new Date();

    this.cal = { which, year: d.getFullYear(), month: d.getMonth() };
    this.toggleList(false);
    field.appendChild(this.calEl);
    this.calEl.hidden = false;
    this.renderCal();
  },

  closeCal() {
    if (this.calEl) this.calEl.hidden = true;
  },

  renderCal() {
    const { which, year, month } = this.cal;
    const e = this.els;
    const selected = (which === "from" ? e.fromPicker : e.toPicker).value;
    const min = which === "to" ? e.fromPicker.value : "";
    const today = this.isoOf(new Date());

    const lead = new Date(year, month, 1).getDay();            // Sunday first
    const total = new Date(year, month + 1, 0).getDate();
    let cells = "";
    for (let i = 0; i < lead; i++) cells += `<span class="ap-cal__blank"></span>`;
    for (let d = 1; d <= total; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const cls = ["ap-cal__day", iso === selected ? "is-sel" : "", iso === today ? "is-today" : ""].join(" ");
      cells += `<button type="button" class="${cls}" data-iso="${iso}" ${min && iso < min ? "disabled" : ""}>${d}</button>`;
    }

    this.calEl.innerHTML = `
      <div class="ap-cal__head">
        <button type="button" class="ap-cal__nav" data-nav="-1" title="Previous month">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <b>${this.MONTHS[month]} ${year}</b>
        <button type="button" class="ap-cal__nav" data-nav="1" title="Next month">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div class="ap-cal__week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
      <div class="ap-cal__grid">${cells}</div>
      <div class="ap-cal__foot">
        <button type="button" data-clear="1">Clear</button>
        <button type="button" data-today="1">Today</button>
      </div>`;
  },

  onCalClick(ev) {
    ev.stopPropagation();                       // keep the calendar open while re-rendering
    const nav = ev.target.closest("[data-nav]");
    if (nav) {
      let m = this.cal.month + Number(nav.dataset.nav);
      let y = this.cal.year;
      if (m < 0)  { m = 11; y--; }
      if (m > 11) { m = 0;  y++; }
      this.cal.month = m;
      this.cal.year = y;
      this.renderCal();
      return;
    }
    const day = ev.target.closest(".ap-cal__day");
    if (day && !day.disabled) { this.pickDate(day.dataset.iso); return; }
    if (ev.target.closest("[data-today]")) { this.pickDate(this.isoOf(new Date())); return; }
    if (ev.target.closest("[data-clear]")) {
      this.setDate(this.cal.which, "");
      this.updateDays();
      this.closeCal();
    }
  },

  pickDate(iso) {
    const e = this.els;
    const which = this.cal.which;
    if (which === "to" && e.fromPicker.value && iso < e.fromPicker.value) return;   // "to" can't be before "from"

    this.setDate(which, iso);
    // "from" moved past "to", or "to" is empty: keep them in step
    if (which === "from" && (!e.toPicker.value || e.toPicker.value < iso)) this.setDate("to", iso);

    this.updateDays();
    this.closeCal();
  },

  // ---------- dropdown ----------
  toggleList(force) {
    const e = this.els;
    const open = typeof force === "boolean" ? force : !e.box.classList.contains("is-open");
    e.box.classList.toggle("is-open", open);
    if (open) {
      this.closeCal();
      e.search.value = "";
      this.renderList();
      setTimeout(() => e.search.focus(), 30);
    }
  },

  renderList() {
    const e = this.els;
    const q = e.search.value.trim().toLowerCase();
    const items = mockData.leaveCards.filter((c) => c.name.toLowerCase().includes(q));

    let html = "";
    if (!q) {
      html += `<div class="ap-opt ap-opt--none ${this.typeId ? "" : "is-selected"}" data-id="">Select</div>`;
    }
    html += items.map((c) => `
      <div class="ap-opt ${c.id === this.typeId ? "is-selected" : ""}" data-id="${c.id}" style="--c:${c.color}; --cbg:${c.bg}">
        <span class="ap-opt__dot"></span>
        <span class="ap-opt__name">${c.name}</span>
        <span class="ap-opt__bal">${c.available} left</span>
      </div>`).join("");

    if (!items.length) html += `<div class="ap-opt--empty">No results found</div>`;
    e.list.innerHTML = html;
  },

  // colours, icon, title and balance follow the selected type
  setType(id) {
    const e = this.els;
    this.typeId = id || "";
    const c = mockData.leaveCards.find((x) => x.id === this.typeId);

    if (c) {
      e.modal.style.setProperty("--accent", c.color);
      e.modal.style.setProperty("--accent-bg", c.bg);
      e.label.textContent = c.name;
      e.label.classList.remove("is-placeholder");
      e.badge.innerHTML = leaveSummary.icon(c.icon, c.color);
      e.title.textContent = c.name;
      e.chip.textContent = "Available: " + c.available;
      e.chip.hidden = false;
    } else {
      e.modal.style.setProperty("--accent", "#1a73e8");
      e.modal.style.setProperty("--accent-bg", "#e8f1fd");
      e.label.textContent = "Select";
      e.label.classList.add("is-placeholder");
      e.badge.innerHTML = leaveSummary.icon("sun", "#1a73e8");
      e.title.textContent = "Leave";
      e.chip.hidden = true;
    }
    e.errType.textContent = "";
  },

  // "Total: N days" (counting both dates)
  updateDays() {
    const { fromPicker, toPicker, days } = this.els;
    if (!fromPicker.value || !toPicker.value || toPicker.value < fromPicker.value) {
      days.hidden = true;
      return;
    }
    const n = Math.round((new Date(toPicker.value) - new Date(fromPicker.value)) / 86400000) + 1;
    days.textContent = `Total: ${n} ${n === 1 ? "day" : "days"}`;
    days.hidden = false;
  },

  clearErrors() {
    ["errType", "errDate", "errEmail"].forEach((k) => (this.els[k].textContent = ""));
  },

  submit() {
    const e = this.els;
    this.clearErrors();
    let ok = true;

    if (!this.typeId) { e.errType.textContent = "Select a leave type."; ok = false; }

    if (!e.fromPicker.value || !e.toPicker.value) {
      e.errDate.textContent = "Select both dates."; ok = false;
    } else if (e.toPicker.value < e.fromPicker.value) {
      e.errDate.textContent = "To date can't be before From date."; ok = false;
    }

    if (e.email.value && !/^\S+@\S+\.\S+$/.test(e.email.value)) {
      e.errEmail.textContent = "Enter a valid email ID."; ok = false;
    }

    if (!ok) {
      e.card.classList.remove("shake");
      void e.card.offsetWidth;              // restart the animation
      e.card.classList.add("shake");
      return;
    }

    // Later this becomes a call to Zoho Creator
    const payload = {
      leaveType: this.typeId,
      from: e.from.value,
      to: e.to.value,
      teamEmail: e.email.value,
      reason: e.reason.value
    };
    console.log("Apply leave payload:", payload);

    this.close();
    this.showToast("Leave request submitted");
  },

  showToast(msg) {
    const t = this.els.toast;
    t.textContent = msg;
    t.hidden = false;
    t.classList.remove("show");
    void t.offsetWidth;
    t.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (t.hidden = true), 3200);
  }
};