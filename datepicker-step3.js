// Setup
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
const currentDate = moment('2023-11-18');
let whichMonth = currentDate.month();
let showingMonth = moment().month(10).format('MMMM');

// On Load
btnOpenDP.removeAttribute('hidden');

// Events

// "Show the dialog" button opens the dialog modally
btnOpenDP.addEventListener("click", () => {
  dialog.showModal();
	createCalendarTable(whichMonth);
});

// "Close" button closes the dialog
btnCloseDP.addEventListener("click", () => {
  dialog.close();
});

// Cycle through available months
btnPrevious.addEventListener('click', function () {
  goToPreviousMonth();
})
btnNext.addEventListener('click', function () {
  goToNextMonth();
})

// Submit the form
btnSubmit.addEventListener('click', function () {
  const currentText = inputDate.value;
	const valueReformatted = moment(currentText, 'DD/MM/YY');
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

function setMonthIndicator() {
  monthIndicator.innerHTML = showingMonth;
}

function createCalendarTable(whichMonth) {
	console.log('create calendar table');
  // setup
  const tableLocation = dialog.querySelector('.dp-body');
  const tableCalendar = tableLocation.querySelector('table');
  setMonthIndicator();

  // get current details
  const daysInCurrentMonth = moment().month(whichMonth).daysInMonth();
  const weeksInCurrentMonth = 6; // temp hardcode, was Math.ceil(daysInCurrentMonth / 7) but that broke September

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
	removeEmptyTableRows();
	highlightToday();
	highlightSelected();

  // add listener for any selections. gotta do it after the buttons are created.
  tableCalendar.addEventListener('click', function (e) {
    sendSelectedDate(e);
  })
}

function populateTable(howManyDays) {
	console.log('populate table');
  // put all cells in a collection
  const tableCells = dialog.querySelectorAll('td');
  // clear out any previous content
  tableCells.forEach(function (cell) {
    cell.innerHTML = '';
  })
  // put updated content in them
	const startDayOfShowingMonth = moment().month(showingMonth).date(1).day();
  for (var m = 0; m < howManyDays; m++) {
    let currentDay = startDayOfShowingMonth + m;
    let currentCell = tableCells[currentDay];
    currentCell.innerHTML = '<button type="button" class="btn-date">' + (m + 1) + '</button>';
  }
  disableInvalidDates(whichMonth);
}

function disableInvalidDates(currentMonth) {
	console.log("disable invalid dates");
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

function removeEmptyTableRows() {
	console.log('remove empty rows');
	const currentTable = dialog.querySelector("table");
	const tableRows = currentTable.querySelectorAll('tr');
	tableRows.forEach(function (row, i) {
		let rowType = row.querySelector('th');
		let buttons = row.querySelectorAll('.btn-date');
		if (!buttons.length && !rowType) {// no buttons found in the row, row is not a header row
			row.remove();
		}
	})
}

function highlightToday() {
	const showingBtns = document.querySelectorAll('.btn-date');
	// what day is it today
	const todayMonth = currentDate.month();
	if (todayMonth === whichMonth) {
		const today = currentDate.date().toString();
		console.log('highlight today' + today);
		showingBtns.forEach(function (button, i) {
			if (button.innerText === today) {
				button.classList.add('is-today');
			}
		})
	}
}

function highlightSelected() {
	console.log('highlight selected');
	const selectedDate = moment(inputDate.value, "DD/MM/YYYY");
	const showingBtns = document.querySelectorAll('.btn-date');
	// have they chosen a date previously
	if (selectedDate) {
		const selectedMonth = selectedDate.month();
		if (selectedMonth === whichMonth) {
			const selectedDay = selectedDate.date().toString();
			showingBtns.forEach(function (button, i) {
				if (button.innerText === selectedDay) {
					button.classList.add('is-selected');
					return;
				}
			})
		}
	}
}

function goToPreviousMonth() {
	console.log('go to previous month');
	whichMonth = whichMonth - 1;
	showingMonth = moment().month(whichMonth).format('MMMM');
  createCalendarTable(whichMonth);
	setMonthIndicator();
  monthIndicator.focus();
  updatePrevNextStatus();
}

function goToNextMonth() {
	console.log('go to next month');
  whichMonth = whichMonth + 1;
	showingMonth = moment().month(whichMonth).format('MMMM');
  createCalendarTable(whichMonth);
	setMonthIndicator();
  monthIndicator.focus();
	updatePrevNextStatus();
}

function updatePrevNextStatus() {
	console.log('update prev/next button status');
  if (whichMonth === earliestDate.month()) {
    btnPrevious.setAttribute('disabled', 'disabled');
		btnNext.removeAttribute('disabled');
  } else if (whichMonth === latestDate.month()) {
    btnNext.setAttribute('disabled', 'disabled');
		btnPrevious.removeAttribute('disabled');
  } else {
    btnPrevious.removeAttribute('disabled');
    btnNext.removeAttribute('disabled');
  }
}

function sendSelectedDate(whichOne) {
	console.log("send selected date");
  const whichBtn = whichOne.target;
  const whichDay = whichBtn.innerHTML;
  const whichDate = moment().year(2023).month(whichMonth).date(whichDay).format('DD/MM/YYYY');
  inputDate.value = '';
  inputDate.value = whichDate;
  dialog.close();
}