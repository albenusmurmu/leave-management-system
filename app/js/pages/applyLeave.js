const applyLeave = {
  els: {},
  typeId: "",
  toastTimer: null,

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
      if (e.box.classList.contains("is-open")) this.toggleList(false);
      else this.close();
    });

    // date fields: text box + calendar icon open the native date picker
    document.querySelectorAll(".ap-date").forEach((field) => {
      const text = field.querySelector("input[type=text]");
      const picker = field.querySelector("input[type=date]");
      const openPicker = () => (picker.showPicker ? picker.showPicker() : picker.click());

      text.addEventListener("click", openPicker);
      field.querySelector(".ap-date__btn").addEventListener("click", openPicker);
      picker.addEventListener("change", () => {
        text.value = picker.value ? this.toDisplay(picker.value) : "";
        // if "to" is empty, copy the "from" date
        if (text === e.from && !e.to.value && picker.value) this.setDate("to", picker.value);
        this.updateDays();
      });
    });

    e.reason.addEventListener("input", () => {
      e.count.textContent = `${e.reason.value.length}/250`;
    });
  },

  // dd-MM-yyyy <-> yyyy-MM-dd
  toISO(d)     { const [dd, mm, yy] = d.split("-"); return `${yy}-${mm}-${dd}`; },
  toDisplay(i) { const [yy, mm, dd] = i.split("-"); return `${dd}-${mm}-${yy}`; },

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

    e.modal.hidden = false;
  },

  close() {
    this.els.modal.hidden = true;
  },

  // ---------- dropdown ----------
  toggleList(force) {
    const e = this.els;
    const open = typeof force === "boolean" ? force : !e.box.classList.contains("is-open");
    e.box.classList.toggle("is-open", open);
    if (open) {
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