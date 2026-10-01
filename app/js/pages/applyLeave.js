const applyLeave = {
  els: {},

  init() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      modal: $("applyModal"), type: $("fLeaveType"),
      from: $("fFrom"), to: $("fTo"),
      fromPicker: $("fFromPicker"), toPicker: $("fToPicker"),
      email: $("fEmail"), reason: $("fReason"),
      errType: $("errType"), errDate: $("errDate"), errEmail: $("errEmail"),
      badge: $("leaveBadge"), title: $("leaveTitle"),
      chip: $("balanceChip"), days: $("daysChip")
    };

    $("applyClose").addEventListener("click", () => this.close());
    $("applyCancel").addEventListener("click", () => this.close());
    $("applySubmit").addEventListener("click", () => this.submit());
    this.els.type.addEventListener("change", () => this.updateType());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.close(); });

    // calendar icons and inputs open the native date picker
    document.querySelectorAll(".date-field").forEach((field) => {
      const text = field.querySelector("input[type=text]");
      const picker = field.querySelector("input[type=date]");
      const openPicker = () => picker.showPicker ? picker.showPicker() : picker.click();

      text.addEventListener("click", openPicker);
      field.querySelector(".date-field__btn").addEventListener("click", openPicker);
      picker.addEventListener("change", () => {
        text.value = picker.value ? this.toDisplay(picker.value) : "";
        // if "to" is empty, copy the "from" date as a convenience
        if (text === this.els.from && !this.els.to.value && picker.value) {
          this.setDate("to", picker.value);
        }
      });
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

  // typeId: pre-select a leave type. date: "dd-MM-yyyy" pre-fills both dates.
  open({ typeId = "", date = "" } = {}) {
    const e = this.els;

    e.type.innerHTML =
      `<option value="">Select</option>` +
      mockData.leaveCards.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
    e.type.value = typeId;

    const iso = date ? this.toISO(date) : "";
    this.setDate("from", iso);
    this.setDate("to", iso);

    e.email.value = "";
    e.reason.value = "";
    this.clearErrors();

    e.modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  },

  close() {
    this.els.modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  },

  clearErrors() {
    ["errType", "errDate", "errEmail"].forEach((k) => (this.els[k].textContent = ""));
  },

  submit() {
    const e = this.els;
    this.clearErrors();
    let ok = true;

    if (!e.type.value) { e.errType.textContent = "Select a leave type."; ok = false; }

    if (!e.fromPicker.value || !e.toPicker.value) {
      e.errDate.textContent = "Select both dates."; ok = false;
    } else if (e.toPicker.value < e.fromPicker.value) {
      e.errDate.textContent = "To date can't be before From date."; ok = false;
    }

    if (e.email.value && !/^\S+@\S+\.\S+$/.test(e.email.value)) {
      e.errEmail.textContent = "Enter a valid email ID."; ok = false;
    }

    if (!ok) return;

    // Later this becomes a Zoho People API call
    const payload = {
      leaveType: e.type.value,
      from: e.from.value,
      to: e.to.value,
      teamEmail: e.email.value,
      reason: e.reason.value
    };
    console.log("Apply leave payload:", payload);
    this.close();
  }
};