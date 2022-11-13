const MonthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
]

export function to12hour(hours) {
    const period = hours >= 12 ? 'PM' : 'AM'
    if (hours > 12) hours -= 12
    return `${hours} ${period}`
}

export const getMonthName = (month) => MonthNames[month]

export const toDateString = (date) => `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;