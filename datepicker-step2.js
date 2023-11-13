const dialog = document.querySelector("dialog");
const btnOpenDP = document.getElementById("dp1-opener");
const btnCloseDP = document.getElementById("dp1-closer");

// "Show the dialog" button opens the dialog modally
btnOpenDP.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
btnCloseDP.addEventListener("click", () => {
  dialog.close();
});
