// Główne dane gry
let state = {
  cash: 1000,
  btc: 0,
  storage: 0,
  storageLimit: 1000,
  inventory: {
    kokaina: 0,
    marihuana: 0,
    mefedron: 0,
    amfetamina: 0,
    pixy: 0,
    lsd: 0,
    grzyby: 0,
    crack: 0
  },
  workers: [],
};

// Lista pracowników
const workerNames = ["Krzysiek", "Michał", "Sandra", "Julka", "Zbyszek", "Anka"];

// Odświeżanie interfejsu
function updateUI() {
  document.getElementById("cash").innerText = state.cash.toFixed(2);
  document.getElementById("btc").innerText = state.btc.toFixed(3);
  document.getElementById("storageUsed").innerText = state.storage;
  document.getElementById("storageLimit").innerText = state.storageLimit;

  let invHtml = "";
  for (let drug in state.inventory) {
    invHtml += `${drug}: ${state.inventory[drug]}g<br>`;
  }
  document.getElementById("inventory").innerHTML = invHtml;

  document.getElementById("workersList").innerHTML = state.workers.map(w =>
    `${w.name} sprzedaje ${w.amount}g ${w.drug} po ${w.price} zł/g`).join("<br>");

  let options = "";
  for (let name of workerNames) {
    options += `<option value="${name}">${name}</option>`;
  }
  document.getElementById("workerName").innerHTML = options;
}

// Kup narkotyki
function manualBuy() {
  const drug = document.getElementById("buyDrug").value;
  const amount = parseInt(document.getElementById("buyAmount").value);
  const price = parseFloat(document.getElementById("buyPrice").value);
  if (state.cash >= amount * price && state.storage + amount <= state.storageLimit) {
    state.cash -= amount * price;
    state.inventory[drug] += amount;
    state.storage += amount;
  }
  updateUI();
}

// Sprzedaj narkotyki
function manualSell() {
  const drug = document.getElementById("sellDrug").value;
  const amount = parseInt(document.getElementById("sellAmount").value);
  const price = parseFloat(document.getElementById("sellPrice").value);
  if (state.inventory[drug] >= amount) {
    state.cash += amount * price;
    state.inventory[drug] -= amount;
    state.storage -= amount;
  }
  updateUI();
}

// Pracownicy
function assignToWorker() {
  const name = document.getElementById("workerName").value;
  const drug = document.getElementById("workerDrug").value;
  const amount = parseInt(document.getElementById("workerAmount").value);
  const price = parseFloat(document.getElementById("workerPrice").value);
  if (state.inventory[drug] >= amount) {
    state.inventory[drug] -= amount;
    state.storage -= amount;
    state.workers.push({ name, drug, amount, price });
  }
  updateUI();
}

// Pracownicy pracują co 5s
setInterval(() => {
  for (let w of state.workers) {
    const profit = w.amount * w.price;
    state.cash += profit;
  }
  state.workers = [];
  updateUI();
}, 5000);

// BTC
const btc = {
  deposit: function () {
    const amt = parseFloat(document.getElementById("btcAmount").value);
    if (state.cash >= amt * 100000) {
      state.cash -= amt * 100000;
      state.btc += amt;
      updateUI();
    }
  },
  withdraw: function () {
    const amt = parseFloat(document.getElementById("btcAmount").value);
    if (state.btc >= amt) {
      state.cash += amt * 100000;
      state.btc -= amt;
      updateUI();
    }
  }
};

// Zapis gry
function saveGame() {
  localStorage.setItem("dDrugsSave", JSON.stringify(state));
  alert("Gra zapisana!");
}
function loadGame() {
  const save = localStorage.getItem("dDrugsSave");
  if (save) {
    state = JSON.parse(save);
    updateUI();
    alert("Gra wczytana!");
  }
}
function resetGame() {
  if (confirm("Na pewno chcesz zresetować grę?")) {
    localStorage.removeItem("dDrugsSave");
    location.reload();
  }
}

// Start
updateUI();
