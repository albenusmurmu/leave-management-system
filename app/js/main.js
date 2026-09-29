const tabs = document.querySelectorAll(".subtabs__tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("is-active"));
    panels.forEach((p) => p.classList.remove("is-active"));

    tab.classList.add("is-active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("is-active");
  });
});

leaveSummary.init();