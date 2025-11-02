/**
 * 星を描画して比較エリアに追加する関数
 * @param {string} name - 星の名前
 * @param {number} diameter - 星の直径（km）
 * @param {number} mass - 星の質量（kg）
 * @param {string} type - 星のカテゴリ（"earth" | "solar" | "exoplanet" | "star"）
 */
function animatePlanet(name, diameter, mass, type) {
  const earthDiameter = 12742; // 地球の直径（基準）
  const earthMass = 5.97e24;   // 地球の質量（基準）
  const maxDisplaySize = 300;  // 表示サイズの最大値（px）
  const lightSpeedKmPerSec = 299792; // 光速（km/s）

  // 地球との相対比を計算
  const diameterRatio = diameter / earthDiameter;
  const massRatio = mass / earthMass;
  const targetSize = Math.min(diameterRatio * 20, maxDisplaySize);
  const finalSize = Math.max(targetSize, 5);

  const comparisonArea = document.getElementById("comparisonArea");

  // 星の表示コンテナを作成
  const planetDiv = document.createElement("div");
  planetDiv.className = "planet";

  // ドラッグ属性とイベントを設定（ドロップは drop-zone のみ）
  planetDiv.setAttribute("draggable", "true");
  planetDiv.addEventListener("dragstart", handleDragStart);

  // SVGと円を作成
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 5);
  svg.setAttribute("height", 5);

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 2.5);
  circle.setAttribute("cy", 2.5);
  circle.setAttribute("r", 2.5);
  circle.setAttribute("stroke", "#fff");
  circle.setAttribute("stroke-width", "1");

  // カテゴリに応じたグラデーションを設定
  if (type === "earth") {
    circle.setAttribute("fill", "url(#earthGradient)");
  } else if (type === "solar" || type === "exoplanet") {
    circle.setAttribute("fill", "url(#planetGradient)");
  } else if (type === "star") {
    circle.setAttribute("fill", "url(#starGradient)");
  }

  svg.appendChild(circle);
  planetDiv.appendChild(svg);

  // 距離表示の準備（地球は除外）
  let distanceText = "";
  const category = (type === "earth") ? "solar" : type;
  const data = window.starData[category][name];

  if (type !== "earth") {
    if (data.distanceKm !== undefined) {
      const seconds = data.distanceKm / lightSpeedKmPerSec;
      const minutes = seconds / 60;
      const hours = minutes / 60;
      const days = hours / 24;
      const years = days / 365.25;

      if (years >= 1) {
        distanceText = `地球から: ${data.distanceKm.toLocaleString()} km（光速で約 ${years.toFixed(2)} 年）`;
      } else if (days >= 1) {
        distanceText = `地球から: ${data.distanceKm.toLocaleString()} km（光速で約 ${days.toFixed(1)} 日）`;
      } else if (hours >= 1) {
        distanceText = `地球から: ${data.distanceKm.toLocaleString()} km（光速で約 ${hours.toFixed(1)} 時間）`;
      } else {
        distanceText = `地球から: ${data.distanceKm.toLocaleString()} km（光速で約 ${minutes.toFixed(1)} 分）`;
      }
    } else if (data.distanceLy !== undefined) {
      distanceText = `地球から: 約 ${data.distanceLy} 光年`;
    }
  }

  // ラベル作成
  const label = document.createElement("div");
  label.className = "label";

  if (type === "earth") {
    label.innerHTML = `${name}<br>直径: ${diameter.toLocaleString()} km<br>質量: ${mass.toExponential(2)} kg`;
  } else {
    label.innerHTML = `${name}<br>直径: ${diameter.toLocaleString()} km（地球の約 ${diameterRatio.toFixed(2)} 倍）<br>質量: ${mass.toExponential(2)} kg（地球の約 ${massRatio.toFixed(2)} 倍）`;
    if (distanceText) {
      label.innerHTML += `<br>${distanceText}`;
    }
  }

  planetDiv.appendChild(label);
  comparisonArea.appendChild(planetDiv); // 星本体のみ追加

  animateGrowth(svg, circle, finalSize); // アニメーション開始

  updateDropZones(); // drop-zone を並び全体に再配置
}

//
// ドラッグ＆ドロップ関連の処理
//

let draggedItem = null; // 現在ドラッグ中の要素

function handleDragStart(e) {
  draggedItem = e.currentTarget;
  e.dataTransfer.effectAllowed = "move";
}

/**
 * drop-zone を生成する関数
 */
function createDropZone() {
  const zone = document.createElement("div");
  zone.className = "drop-zone";
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });
  zone.addEventListener("dragenter", () => zone.classList.add("active"));
  zone.addEventListener("dragleave", () => zone.classList.remove("active"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("active");
    if (draggedItem) {
      const parent = zone.parentNode;
      parent.insertBefore(draggedItem, zone.nextSibling);
      updateDropZones(); // 並び変更後に drop-zone を再配置
    }
  });
  return zone;
}

/**
 * 現在の星の並びに応じて drop-zone を再配置する関数
 */
function updateDropZones() {
  const comparisonArea = document.getElementById("comparisonArea");

  // 既存の drop-zone をすべて削除
  const oldZones = comparisonArea.querySelectorAll(".drop-zone");
  oldZones.forEach(zone => zone.remove());

  // 現在の .planet 要素を取得
  const planets = Array.from(comparisonArea.querySelectorAll(".planet"));

  // 並びの先頭に drop-zone を追加
  if (planets.length > 0) {
    const firstZone = createDropZone();
    comparisonArea.insertBefore(firstZone, planets[0]);
  }

  // 各星の間に drop-zone を挿入
  for (let i = 0; i < planets.length - 1; i++) {
    const zone = createDropZone();
    comparisonArea.insertBefore(zone, planets[i + 1]);
  }

  // 並びの末尾にも drop-zone を追加
  const lastZone = createDropZone();
  comparisonArea.appendChild(lastZone);
}