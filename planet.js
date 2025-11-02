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

  // 表示サイズを計算（倍率調整）
  const targetSize = Math.min(diameterRatio * 20, maxDisplaySize);
  const finalSize = Math.max(targetSize, 5);

  // 表示エリアを取得
  const comparisonArea = document.getElementById("comparisonArea");

  // 星の表示コンテナを作成
  const planetDiv = document.createElement("div");
  planetDiv.className = "planet";

  // SVGと円（circle）を初期サイズで作成
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 5);
  svg.setAttribute("height", 5);

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 2.5);
  circle.setAttribute("cy", 2.5);
  circle.setAttribute("r", 2.5);
  circle.setAttribute("stroke", "#fff");
  circle.setAttribute("stroke-width", "1");

  // カテゴリに応じてグラデーションを設定
  if (type === "earth") {
    circle.setAttribute("fill", "url(#earthGradient)");
  } else if (type === "solar" || type === "exoplanet") {
    circle.setAttribute("fill", "url(#planetGradient)");
  } else if (type === "star") {
    circle.setAttribute("fill", "url(#starGradient)");
  }

  svg.appendChild(circle);
  planetDiv.appendChild(svg);

  // 距離表示の準備
  let distanceText = "";
  const category = (type === "earth") ? "solar" : type; // 地球は solar カテゴリに属する
  const data = window.starData[category][name];

  // 地球以外の場合のみ距離情報を表示
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

  // ラベル作成（地球は距離情報を表示しない）
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
  comparisonArea.appendChild(planetDiv);

  // アニメーション開始（膨張処理）
  animateGrowth(svg, circle, finalSize);
}