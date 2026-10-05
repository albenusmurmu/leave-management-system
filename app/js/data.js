// Mock data. Later this will be replaced by Zoho Creator data.
const mockData = {
  summary: {
    leaveBooked: 0,
    absentDays: 2
  },

  // One entry per card. "color" is the icon color, "bg" is the icon box background.
  leaveCards: [
    { id: "compoff", name: "Compensatory Off", available: 0,   booked: 0, color: "#7cb342", bg: "#e6f2d9", icon: "sun"   },
    { id: "earned",  name: "Earned Leave",      available: 1,   booked: 0, color: "#7cb342", bg: "#e6f2d9", icon: "timer" },
    { id: "lwp",     name: "Leave Without Pay", available: 21,  booked: 0, color: "#e5484d", bg: "#fde3e3", icon: "sun"   },
    { id: "sick",    name: "Sick Leave",        available: 0.5, booked: 0, color: "#3bb4e5", bg: "#def4fc", icon: "sun"   }
  ],

  absent: [
    { date: "31-08-2026", day: "Monday",   days: 1 },
    { date: "27-08-2026", day: "Thursday", days: 1 }
  ],

  // each item has a type: "holiday" or "leave"
  agenda: {
    upcoming: [
      { date: "02-10-2026", name: "Gandhi Jayanti",           type: "holiday" },
      { date: "06-10-2026", name: "Earned Leave",             type: "leave", days: 1 },  // sample
      { date: "20-10-2026", name: "Dussehra (Vijayadashami)", type: "holiday" },
      { date: "08-11-2026", name: "Diwali",                   type: "holiday" },
      { date: "25-12-2026", name: "Christmas",                type: "holiday" }
    ],
      // Calendar: "fixed" holidays repeat every year (dd-mm), "dated" are one-offs (dd-mm-yyyy)
  calendar: {
    minYear: 2020,
    maxYear: 2030,
    fixed: {
      "26-01": "Republic Day",
      "15-08": "Independence Day",
      "02-10": "Gandhi Jayanti",
      "25-12": "Christmas"
    },
    dated: {
      "28-08-2026": "Raksha Bandhan",
      "04-09-2026": "Janmashtami",
      "20-10-2026": "Dussehra (Vijayadashami)",
      "08-11-2026": "Diwali"
    }
  },
    past: [
      { date: "04-09-2026", name: "Janmashtami",      type: "holiday" },
      { date: "28-08-2026", name: "Raksha Bandhan",   type: "holiday" },
      { date: "15-08-2026", name: "Independence Day", type: "holiday" }
    ]
  }
};