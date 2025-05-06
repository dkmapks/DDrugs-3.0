let cash = 1000;
let btcBalance = 0;
let storageUsed = 0;
let storageLimit = 100;

let inventory = {
  kokaina: 0,
  marihuana: 0,
  mefedron: 0,
  amfetamina: 0,
  pixy: 0,
};

let warehouseLevels = [
  { name: "Mały magazyn", cost: 500, capacity: 100 },
  { name: "Średni magazyn", cost: 1000, capacity: 200 },
  { name: "Duży magazyn", cost: 2000, capacity: 500 },
];

let production = {
  kokaina: { cost: 500, time: 5000 },
  marihuana: { cost: 100, time: 2000 },
  mefedron: { cost: 700, time: 6000 },
  amfetamina: { cost: 300, time: 4000 },
  pixy: { cost: 200, time: 3000 },
};

let marketPrices = {
  kokaina: 200,
  marihuana: 30,
  mefedron: 50,
  amfetamina: 40,
  pixy: 20,
};

let playerStats = {
  totalMoney: 0,
  totalSales: 0,
  totalBought: 0,
};

let shopItems = [
  { name: "Plecak", cost: 1000, description: "Zwiększa pojemność magazynu o 50g" },
  { name: "Samochód", cost: 5000, description: "Przyspiesza dostawy o 10%" },
  { name: "Ochrona", cost: 2000, description: "Zmniejsza ryzyko utraty towaru" },
];

function updateUI() {
  document.getElementById("cash").innerText = cash;
  document.getElementById("btc").innerText = btcBalance.toFixed(3);
  document.getElementById("storageUsed").innerText = storageUsed;
  document.getElementById("storageLimit").innerText = storageLimit;

  let warehouseHTML = "";
  warehouseLevels.forEach((level, i) => {
    if (i > currentWarehouse && cash >= level.cost) {
      warehouseHTML += `<button onclick="upgradeWarehouse(${i})">${level.name} (${level.capacity}g) za ${level.cost} zł</button><br>`;
    }
  });
  document.getElementById("warehouseOptions").innerHTML = warehouseHTML;

  let marketHTML = "";
  for (let drug in marketPrices) {
    marketHTML += `<p>${drug}: ${marketPrices[drug]} zł/g</p>`;
  }
  document.getElementById("dynamicMarket").innerHTML = marketHTML;

  let productionHTML = "";
  for (let drug in production) {
    productionHTML += `<button onclick="startProduction('${drug}')">Produkuj ${drug} za ${production[drug].cost} zł (czas: ${production[drug].time / 1000} sek)</button><br>`;
  }
  document.getElementById("productionOptions").innerHTML = productionHTML;

  let shopHTML = "";
  shopItems.forEach(item => {
    shopHTML += `<button onclick="buyShopItem('${item.name}')">${item.name} - ${item.cost} zł: ${item.description}</button><br>`;
  });
  document.getElementById("shop").innerHTML = shopHTML;

  let statsHTML = `<p>Całkowita kasa: ${playerStats.totalMoney} zł</p>`;
  statsHTML += `<p>Całkowita sprzedaż: ${playerStats.totalSales} g</p>`;
  statsHTML += `<p>Całkowity zakup: ${playerStats.totalBought} g</p>`;
  document.getElementById("playerStats").innerHTML = statsHTML;
}

function startProduction(drug) {
  let cost = production[drug].cost;
  if (cash >= cost) {
    cash -= cost;
    updateUI();
    setTimeout(() => {
      inventory[drug] += 5;
      storageUsed += 5;
      playerStats.totalBought += 5;
      updateUI();
    }, production[drug].time);
  } else {
    alert("Brak wystarczającej ilości kasy!");
  }
}

function buyShopItem(itemName) {
  let item = shopItems.find(i => i.name === itemName);
  if (cash >= item.cost) {
    cash -= item.cost;
    if (itemName === "Plecak") {
      storageLimit += 50;
    } else if (itemName === "Samochód") {
      alert("Samochód kupiony! Przyspiesza dostawy.");
    } else if (itemName === "Ochrona") {
      alert("Ochrona kupiona! Zmniejsza ryzyko utraty towaru.");
    }
    updateUI();
  } else {
    alert("Brak wystarczającej ilości kasy!");
  }
}

function manualBuy() {
  let drug = document.getElementById("buyDrug").value;
  let amount = parseInt(document.getElementById("buyAmount").value);
  let price = parseInt(document.getElementById("buyPrice").value);
  let totalCost = price * amount;

  if (cash >= totalCost && storageUsed + amount <= storageLimit) {
    cash -= totalCost;
    inventory[drug] += amount;
    storageUsed += amount;
    updateUI();
  } else {
    alert("Brak środków lub miejsca w magazynie.");
  }
}

function manualSell() {
  let drug = document.getElementById("sellDrug").value;
  let amount = parseInt(document.getElementById("sellAmount").value);
  let price = parseInt(document.getElementById("sellPrice").value);
  let totalRevenue = price * amount;

  if (inventory[drug] >= amount) {
    inventory[drug] -= amount;
    storageUsed -= amount;
    cash += totalRevenue;
    playerStats.totalSales += amount;
    updateUI();
  } else {
    alert("Brak wystarczającej ilości towaru.");
  }
}

setInterval(updateUI, 1000);
