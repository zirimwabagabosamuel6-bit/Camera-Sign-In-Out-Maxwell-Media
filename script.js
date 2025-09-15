let cameraStatus = {
  isOut: false,
  holder: null,
  passcode: null,
  log: []
};

function updateUI() {
  const statusBanner = document.getElementById("statusBanner");
  const signOutForm = document.getElementById("signOutForm");
  const signInForm = document.getElementById("signInForm");
  const logTable = document.getElementById("logTable");

  // Update status
  if (cameraStatus.isOut) {
    statusBanner.className = "status unavailable";
    statusBanner.innerText = `❌ Camera is Out (with ${cameraStatus.holder})`;
    signOutForm.classList.add("hidden");
    signInForm.classList.remove("hidden");
  } else {
    statusBanner.className = "status available";
    statusBanner.innerText = "✅ Camera is Available";
    signOutForm.classList.remove("hidden");
    signInForm.classList.add("hidden");
  }

  // Update table
  logTable.innerHTML = "";
  cameraStatus.log.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.passcode}</td>
      <td>${entry.signedOut}</td>
      <td>${entry.signedIn || "-"}</td>
    `;
    logTable.appendChild(row);
  });
}

function generatePasscode(name) {
  const randomNum = Math.floor(Math.random() * 90) + 10; // 2-digit number
  return name + randomNum;
}

function signOutCamera() {
  const name = document.getElementById("signOutName").value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }
  if (cameraStatus.isOut) {
    alert("Camera is already signed out!");
    return;
  }

  const passcode = generatePasscode(name);
  const now = new Date().toLocaleString();

  cameraStatus.isOut = true;
  cameraStatus.holder = name;
  cameraStatus.passcode = passcode;
  cameraStatus.log.push({
    name,
    passcode,
    signedOut: now,
    signedIn: null
  });

  alert(`Camera signed out!\nYour passcode is: ${passcode}\nYou will need it to sign the camera back in.`);

  updateUI();
}

function signInCamera() {
  const name = document.getElementById("signInName").value.trim();
  const passcode = document.getElementById("signInPasscode").value.trim();

  if (!name || !passcode) {
    alert("Please enter both name and passcode!");
    return;
  }

  if (!cameraStatus.isOut || cameraStatus.holder !== name || cameraStatus.passcode !== passcode) {
    alert("Invalid name or passcode!");
    return;
  }

  const now = new Date().toLocaleString();
  const lastEntry = cameraStatus.log[cameraStatus.log.length - 1];
  lastEntry.signedIn = now;

  cameraStatus.isOut = false;
  cameraStatus.holder = null;
  cameraStatus.passcode = null;

  alert("Camera signed back in successfully!");

  updateUI();
}

// Initialize
updateUI();
