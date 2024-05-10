export const mappedFilterDate = {
  Today: {
    from: new Date(new Date().setHours(0, 0, 0)).toISOString(),
    to: new Date(new Date().setHours(23, 59, 59)).toISOString()
  },
  ThisMonth: {
    from: new Date(new Date().setDate(1)).toISOString(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString()
  },
  ThisYear: {
    from: new Date(new Date().setMonth(0, 1)).toISOString(),
    to: new Date(new Date().setMonth(11, 31)).toISOString()
  }
}
