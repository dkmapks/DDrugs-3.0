let production = {
  kokaina: { cost: 500, time: 5000 },
  marihuana: { cost: 100, time: 2000 },
  mefedron: { cost: 700, time: 6000 },
  amfetamina: { cost: 300, time: 4000 },
  pixy: { cost: 200, time: 3000 }
};

let marketPrices = {
  kokaina: 200,
  marihuana: 30,
  mefedron: 50,
  amfetamina: 40,
  pixy: 20
};

let playerStats = {
  totalMoney: 0,
  totalSales: 0,
  totalBought: 0
};

let shopItems = [
  { name: "Plecak", cost: 1000, description: "Zwiększa pojemność magazynu o 50g" },
  { name: "Samochód", cost: 5000, description: "Przyspiesza dostawy o 10%" },
  { name: "Ochrona", cost: 2000, description: "Zmniejsza ryzyko utraty towaru" }
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

  // Nowe sekcje:
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
      // Przyspieszenie dostaw
      alert("Samochód kupiony! Przyspiesza dostawy.");
    } else if (itemName === "Ochrona") {
      // Zmniejszenie ryzyka utraty towaru
      alert("Ochrona kupiona! Zmniejsza ryzyko utraty towaru.");
    }
    updateUI();
  } else {
    alert("Brak wystarczającej ilości kasy!");
  }
}

setInterval(updateUI, 1000);
