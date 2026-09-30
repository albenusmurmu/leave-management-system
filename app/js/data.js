// Mock data. Later this will be replaced by Zoho People API calls.
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
  ]
};