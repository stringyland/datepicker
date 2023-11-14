// Setup
//const todaysDate = document.querySelector('#todayIs');
const inputDate = document.querySelector('#date');
const chosenDate = document.querySelector('#chosenDate');
const inputError = document.querySelector('#error-date');
const dialog = document.querySelector("dialog");
const btnOpenDP = document.getElementById("dp1-opener");
const btnCloseDP = dialog.querySelector("#dp1-closer");
const btnPrevious = dialog.querySelector('#dp1-previous');
const btnNext = dialog.querySelector('#dp1-next');
const btnSubmit = document.querySelector('#go');
const monthIndicator = dialog.querySelector('#dp1-currentmonth');

const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const earliestDate = moment('2023-10-17');
const latestDate = moment('2023-12-17');
let currentDate = moment('2023-11-18');

// On Load
//todayIs();
btnOpenDP.removeAttribute('hidden');

// Events

// "Show the dialog" button opens the dialog modally
btnOpenDP.addEventListener("click", () => {
  dialog.showModal();
	createCalendarTable(currentDate);
	//setMonthIndicator();
});

// "Close" button closes the dialog
btnCloseDP.addEventListener("click", () => {
  dialog.close();
});

// Cycle through available months
btnPrevious.addEventListener('click', function () {
  goToPreviousMonth();
  setMonthIndicator();
})

btnNext.addEventListener('click', function () {
  goToNextMonth();
  setMonthIndicator();
})

// Submit the form
btnSubmit.addEventListener('click', function () {
  const currentText = inputDate.value;
	const valueReformatted = moment(currentText, 'DD/MM/YY');
	console.log(valueReformatted);
  if (valueReformatted._isValid) {
    chosenDate.innerHTML = valueReformatted.format('dddd, MMMM Do YYYY');
		chosenDate.parentElement.removeAttribute('hidden');
    inputDate.classList.remove('error');
    //inputDate.setAttribute('aria-labelledby', 'error-date');
    inputError.setAttribute('hidden', 'true');
  } else {
    inputDate.classList.add('error');
    //inputDate.removeAttribute('aria-labelledby')
    inputError.removeAttribute('hidden');
  }
})

// Functions

function todayIs () {
  const now = moment().format('dddd, MMMM Do YYYY');
  todaysDate.innerHTML = now;
}

function setMonthIndicator () {
	console.log("set month indicator");
  let whichMonth = currentDate.month();
  whichMonth = monthsOfYear[whichMonth];
  monthIndicator.innerHTML = whichMonth;
}

function createCalendarTable (whichDate) {
	console.log("create calendar table: " + whichDate);
  // setup
  const tableLocation = dialog.querySelector('.dp-body');
  const tableCalendar = tableLocation.querySelector('table');
  setMonthIndicator();

  // get current details
  const daysInCurrentMonth = whichDate.daysInMonth()
  const weeksInCurrentMonth = 6 // temp hardcode, was Math.ceil(daysInCurrentMonth / 7) but that broke September

  // create table cells
  for (var j = 0; j < weeksInCurrentMonth; j++) {
    var contentRow = document.createElement('tr');
    for (var k = 0; k < 7; k++) {
      var contentCell = document.createElement('td');
      contentRow.appendChild(contentCell);
    }
    tableCalendar.appendChild(contentRow);
  }

  // add buttons to cells
  populateTable(daysInCurrentMonth);

  // add listener for any selections. gotta do it after the buttons are created.
  tableCalendar.addEventListener('click', function (e) {
    sendSelectedDate(e);
  })
}

function populateTable (howManyDays) {
	console.log("populate table: " + howManyDays);
  // put all cells in a collection
  const tableCells = dialog.querySelectorAll('td');
  // clear out any previous content
  tableCells.forEach(function (cell) {
    cell.innerHTML = '';
  })
  // put updated content in them
  const startDayOfThisMonth = currentDate.startOf('month').day();
  for (var m = 0; m < howManyDays; m++) {
    let currentDay = startDayOfThisMonth + m;
    let currentCell = tableCells[currentDay];
    currentCell.innerHTML = '<button type="button">' + (m + 1) + '</button>';
  }
  let whichMonth = currentDate.month();
  disableInvalidDates(whichMonth);
}

function disableInvalidDates (currentMonth) {
	console.log("disable invalid dates: " + currentMonth);
  const earliestMonth = earliestDate.month();
  const latestMonth = latestDate.month();
  let btnsToDisable = [];
  if ((currentMonth > earliestMonth) && (currentMonth < latestMonth)) {
    // do nothing
  } else {
    const existingTable = dialog.querySelector('table');
    const tableButtons = existingTable.querySelectorAll('button');

    if (currentMonth <= earliestMonth) {
      tableButtons.forEach(function (button, i) {
        if (i < (earliestDate.date() - 1)) { // buttons have moved now due to day of week fix
          btnsToDisable = btnsToDisable.concat(button);
        }
      })
      updatePrevNextStatus(btnPrevious);
    } else if (currentMonth >= latestMonth) {
      tableButtons.forEach(function (button, i) {
        if (i > (latestDate.date() - 1)) { // buttons have moved now due to day of week fix
          btnsToDisable = btnsToDisable.concat(button);
        }
      })
      updatePrevNextStatus(btnNext);
    }
    btnsToDisable.forEach(function (button) {
      button.setAttribute('disabled', 'disabled');
    })
  }
}

function updatePrevNextStatus (whichButton) {
	console.log("updating Prev/Next status: " + whichButton);
  if (whichButton === btnPrevious) {
    btnPrevious.setAttribute('disabled', 'disabled');
  } else if (whichButton === btnNext) {
    btnNext.setAttribute('disabled', 'disabled');
  } else {
    btnPrevious.removeAttribute('disabled');
    btnNext.removeAttribute('disabled');
  }
}

function goToPreviousMonth () {
	console.log("go to prev");
  currentDate = currentDate.subtract(1, 'month');
  const newDays = currentDate.daysInMonth();
  updatePrevNextStatus();
  populateTable(newDays);
  monthIndicator.focus();
}

// adapt for Next Month function

function goToNextMonth () {
	console.log("go to next");
  currentDate = currentDate.add(1, 'month')
  const newDays = currentDate.daysInMonth()
  updatePrevNextStatus()
  populateTable(newDays)
  monthIndicator.focus();
}

function sendSelectedDate (whichOne) {
	console.log('send selected date');
  const whichBtn = whichOne.target;
  const btnDates = dialog.querySelectorAll('.dp-body button');
  btnDates.forEach(function (button) {
    button.classList.remove('is-selected');
  })
  whichBtn.classList.add('is-selected');
  const whichDay = whichBtn.innerHTML;
  const whichDate = currentDate.date(whichDay).format('DD/MM/YYYY');
  inputDate.value = '';
  inputDate.value = whichDate;
  dialog.close();
}