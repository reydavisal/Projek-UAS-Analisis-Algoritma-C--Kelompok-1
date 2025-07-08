const items = [
  { weight: 1, value: 10 }, { weight: 2, value: 15 }, { weight: 3, value: 20 },
  { weight: 4, value: 9 }, { weight: 5, value: 25 }, { weight: 2, value: 14 },
  { weight: 6, value: 30 }, { weight: 7, value: 35 }, { weight: 8, value: 40 },
  { weight: 9, value: 22 }, { weight: 3, value: 18 }, { weight: 5, value: 27 },
  { weight: 1, value: 5 }, { weight: 4, value: 12 }, { weight: 6, value: 32 },
  { weight: 7, value: 38 }, { weight: 3, value: 16 }, { weight: 2, value: 11 },
  { weight: 9, value: 45 }, { weight: 10, value: 50 }, { weight: 4, value: 17 },
  { weight: 5, value: 20 }, { weight: 3, value: 19 }, { weight: 2, value: 13 },
  { weight: 1, value: 7 }
];

function getCapacityFromInput() {
  const input = document.getElementById('capacity');
  const cap = parseInt(input.value);
  return isNaN(cap) || cap <= 0 ? 1 : cap;
}

function displayItems(capacity) {
  const container = document.getElementById('items-list');
  container.innerHTML = "<strong>Daftar Barang (Berat, Nilai):</strong><br>";
  items.forEach((item, index) => {
    container.innerHTML += `Barang ${index + 1} → Berat: ${item.weight}, Nilai: ${item.value}<br>`;
  });
  container.innerHTML += `<br><strong>Kapasitas Maksimum Ransel:</strong> ${capacity}`;
}

function knapsackBruteForce(items, capacity) {
  const n = items.length;
  let bestValue = 0;
  let bestCombo = [];

  const start = performance.now();

  const totalCombos = 1 << n; // 2^n
  for (let i = 1; i < totalCombos; i++) {
    let combo = [], totalWeight = 0, totalValue = 0;
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        totalWeight += items[j].weight;
        totalValue += items[j].value;
        combo.push(items[j]);
      }
    }
    if (totalWeight <= capacity && totalValue > bestValue) {
      bestValue = totalValue;
      bestCombo = combo;
    }
  }

  const end = performance.now();
  return {
    value: bestValue,
    chosen: bestCombo,
    time: (end - start).toFixed(10)
  };
}

function knapsackGreedy(items, capacity) {
  const start = performance.now();

  const sorted = items.slice().sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  let totalValue = 0;
  let chosen = [];

  for (const item of sorted) {
    if (capacity >= item.weight) {
      capacity -= item.weight;
      totalValue += item.value;
      chosen.push(item);
    }
  }

  const end = performance.now();
  return {
    value: totalValue,
    chosen,
    time: (end - start).toFixed(10)
  };
}

// Format items dengan nomor, berat, dan nilai
function formatItemsDetailed(arr) {
  return arr
    .map(item => {
      // cari indeks barang di items asli
      const idx = items.indexOf(item) + 1; 
      return `Barang ${idx} (Berat: ${item.weight}, Nilai: ${item.value})`;
    })
    .join(", ");
}

function runKnapsack() {
  const capacity = getCapacityFromInput();
  displayItems(capacity);

  const bf = knapsackBruteForce(items, capacity);
  const gd = knapsackGreedy(items, capacity);

  const output = `
== Brute Force ==
Nilai Maksimum: ${bf.value}
Barang Dipilih: ${formatItemsDetailed(bf.chosen)}
Waktu Eksekusi: ${bf.time} ms

== Greedy ==
Nilai Maksimum: ${gd.value}
Barang Dipilih: ${formatItemsDetailed(gd.chosen)}
Waktu Eksekusi: ${gd.time} ms`;

  document.getElementById("output").textContent = output;
}


// Tampilkan daftar awal dengan kapasitas default saat halaman pertama kali dimuat
window.onload = () => {
  displayItems(getCapacityFromInput());
};
