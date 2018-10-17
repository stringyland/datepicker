
// globals
const todaysDate = document.querySelector('#todayIs')
const inputDate = document.querySelector('#date')
const inputError = document.querySelector('#error-date')
const btnSubmit = document.querySelector('#go')
const chosenDate = document.querySelector('#chosenDate')
const btnToggle = document.querySelector('#dp1-toggler')
const datePicker = document.querySelector('#dp1')
const btnClose = document.querySelector('#dp1-close')
// const headingPicker = document.querySelector('#dp1-heading')
const btnPrevious = document.querySelector('#dp1-previous')
const btnNext = document.querySelector('#dp1-next')

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const earliestDate = moment('2018-06-17')
const latestDate = moment('2018-10-17')
let monthIndicator = document.querySelector('#dp1-currentmonth')
let currentDate = moment('2018-07-17')

// on load
todayIs()
inputDate.value = ''
btnToggle.classList.remove('hidden')
createCalendarTable(currentDate)

// events
btnSubmit.addEventListener('click', function () {
  const currentText = inputDate.value
  const valueReformatted = moment(currentText, 'DD/MM/YY')

  if (valueReformatted.isValid) {
    const textReformatted = valueReformatted.format('dddd, MMMM Do YYYY')
    chosenDate.innerHTML = 'You have chosen ' + textReformatted
    inputDate.classList.remove('error')
    inputDate.setAttribute('aria-labelledby', 'error-date')
    inputError.classList.add('hidden')
  } else {
    inputDate.classList.add('error')
    inputDate.removeAttribute('aria-labelledby')
    inputError.classList.remove('hidden')
  }
})

btnPrevious.addEventListener('click', function () {
  goToPreviousMonth()
  setMonthIndicator()
})

btnNext.addEventListener('click', function () {
  goToNextMonth()
  setMonthIndicator()
})
btnToggle.addEventListener('click', function (e) {
  const body = document.querySelector('body')
  if (body.classList.contains('has-dialog')) {
    closeDialog()
  } else {
    openDialog('dp1', e.target, 'dp1-heading')
  }
})

btnClose.addEventListener('click', function (e) {
  closeDialog()
})

document.addEventListener('keyup', function (e) {
  e.preventDefault()
  findWhichKey(e)
})


// functions
function todayIs () {
  const now = moment().format('dddd, MMMM Do YYYY')
  todaysDate.innerHTML = now
}

function goToPreviousMonth () {
  currentDate = currentDate.subtract(1, 'month')
  const newDays = currentDate.daysInMonth()
  updatePrevNextStatus()
  populateTable(newDays)
  // headingPicker.focus() aria-live handles this
}

function goToNextMonth () {
  currentDate = currentDate.add(1, 'month')
  const newDays = currentDate.daysInMonth()
  updatePrevNextStatus()
  populateTable(newDays)
  // headingPicker.focus()  aria-live handles this
}
function findWhichKey (pressedKey) {
  if (pressedKey.key === 'Escape') {
    closeDialog()
  }
}

function createCalendarTable (whichDate) {
  // setup
  const tableLocation = datePicker.querySelector('.dp-body')
  const tableCalendar = document.createElement('table')
  setMonthIndicator()

  // create table headers
  var headerRow = document.createElement('tr')
  for (var i = 0; i < 7; i++) {
    var headerCell = document.createElement('th')
    headerCell.setAttribute('scope', 'col')
    var headerContent = document.createTextNode(daysOfWeek[i])
    headerCell.appendChild(headerContent)
    headerRow.appendChild(headerCell)
  }
  tableCalendar.appendChild(headerRow)

  // get current details
  const daysInCurrentMonth = whichDate.daysInMonth()
  const weeksInCurrentMonth = 6 // temp hardcode, was Math.ceil(daysInCurrentMonth / 7) but that broke September 2018

  // create table cells
  for (var j = 0; j < weeksInCurrentMonth; j++) {
    var contentRow = document.createElement('tr')
    for (var k = 0; k < 7; k++) {
      var contentCell = document.createElement('td')
      contentRow.appendChild(contentCell)
    }
    tableCalendar.appendChild(contentRow)
  }
  tableLocation.appendChild(tableCalendar)

  // add buttons to cells
  populateTable(daysInCurrentMonth)

  // add listener for any selections. if I do it before the buttons are there it doesn't work
  const tablePicker = document.querySelector('table')
  tablePicker.addEventListener('click', function (e) {
    sendSelectedDate(e)
  })
}

function setMonthIndicator () {
  let whichMonth = currentDate.month()
  whichMonth = monthsOfYear[whichMonth]
  monthIndicator.innerHTML = ' in ' + whichMonth
}

function populateTable (howManyDays) {
  // put all cells in a collection
  const tableCells = document.querySelectorAll('td')
  // clear out any previous content
  tableCells.forEach(function (cell) {
    cell.innerHTML = ''
  })
  // put updated content in them
  const startDayOfThisMonth = currentDate.startOf('month').day()
  for (var m = 0; m < howManyDays; m++) {
    let currentDay = startDayOfThisMonth + m
    let currentCell = tableCells[currentDay]
    currentCell.innerHTML = '<button type="button">' + (m + 1) + '</button>'
  }
  let whichMonth = currentDate.month()
  disableInvalidDates(whichMonth)
}

function disableInvalidDates (currentMonth) {
  const earliestMonth = earliestDate.month()
  const latestMonth = latestDate.month()
  let btnsToDisable = []
  if ((currentMonth > earliestMonth) && (currentMonth < latestMonth)) {
    // do nothing
  } else {
    const existingTable = document.querySelector('table')
    const tableButtons = existingTable.querySelectorAll('button')

    if (currentMonth <= earliestMonth) {
      tableButtons.forEach(function (button, i) {
        if (i < (earliestDate.date() - 1)) { // buttons have moved now due to day of week fix
          btnsToDisable = btnsToDisable.concat(button)
        }
      })
      updatePrevNextStatus(btnPrevious)
    } else if (currentMonth >= latestMonth) {
      tableButtons.forEach(function (button, i) {
        if (i > (latestDate.date() - 1)) { // buttons have moved now due to day of week fix
          btnsToDisable = btnsToDisable.concat(button)
        }
      })
      updatePrevNextStatus(btnNext)
    }
    btnsToDisable.forEach(function (button) {
      button.setAttribute('disabled', 'disabled')
    })
  }
}

function updatePrevNextStatus (whichButton) {
  if (whichButton === btnPrevious) {
    btnPrevious.setAttribute('disabled', 'disabled')
  } else if (whichButton === btnNext) {
    btnNext.setAttribute('disabled', 'disabled')
  } else {
    btnPrevious.removeAttribute('disabled')
    btnNext.removeAttribute('disabled')
  }
}

function sendSelectedDate (whichOne) {
  const whichBtn = whichOne.target
  const btnDates = document.querySelectorAll('.dp-body button')
  btnDates.forEach(function (button) {
    button.removeAttribute('aria-current')
  })
  whichBtn.setAttribute('aria-current', 'selected')
  const whichDay = whichBtn.innerHTML
  const whichDate = currentDate.date(whichDay).format('DD/MM/YYYY')
  inputDate.value = ''
  inputDate.value = whichDate
  closeDialog()
}
