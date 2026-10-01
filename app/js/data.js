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

  holidays: {
    upcoming: [
      { date: "02-10-2026", day: "Friday",  name: "Gandhi Jayanti" },
      { date: "20-10-2026", day: "Tuesday", name: "Dussehra (Vijayadashami)" },
      { date: "08-11-2026", day: "Sunday",  name: "Diwali" },
      { date: "25-12-2026", day: "Friday",  name: "Christmas" }
    ],
    past: [
      { date: "04-09-2026", day: "Friday",   name: "Janmashtami" },
      { date: "28-08-2026", day: "Friday",   name: "Raksha Bandhan" },
      { date: "15-08-2026", day: "Saturday", name: "Independence Day" }
    ]
  }
};