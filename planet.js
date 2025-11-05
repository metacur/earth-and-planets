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
  planetDiv.addEventListener("dragend", handleDragEnd);

  // ドラッグハンドル（視覚的な目印）
  const handle = document.createElement("div");
  handle.className = "drag-handle";
  planetDiv.appendChild(handle);
  
  // カード全体からもドラッグ可能にする（ラベル/SVG以外の領域）
  // mousedownでフラグを立てて、dragstartまで確実に保持
  // captureフェーズで確実にキャッチ（他の要素に阻害されないように）
  planetDiv.addEventListener("mousedown", (e) => {
    // ラベルやSVGの内部をクリックした場合はドラッグしない
    const isLabelOrSvg = e.target.closest('.label') || e.target.closest('svg');
    if (!isLabelOrSvg) {
      dragByHandle = true;
      // フラグを確実に保持するため、短いタイムアウトでクリーンアップ
      // dragstartが発生するまでの間、フラグを保持
      clearTimeout(window._dragHandleTimeout);
      window._dragHandleTimeout = setTimeout(() => {
        if (!draggedItem) {
          dragByHandle = false;
        }
      }, 200);
    }
  }, { passive: true, capture: true });
  
  // タッチ対応
  planetDiv.addEventListener("touchstart", (e) => {
    const isLabelOrSvg = e.target.closest('.label') || e.target.closest('svg');
    if (!isLabelOrSvg) {
      dragByHandle = true;
      clearTimeout(window._dragHandleTimeout);
      window._dragHandleTimeout = setTimeout(() => {
        if (!draggedItem) {
          dragByHandle = false;
        }
      }, 200);
    }
  }, { passive: true, capture: true });

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

  // 通常時はドロップゾーンを配置しない（ドラッグ開始時のみ配置）
  // updateDropZones(); // 削除
}

//
// ドラッグ＆ドロップ関連の処理
//

let draggedItem = null; // 現在ドラッグ中の要素
let placeholderEl = null; // 挿入位置の視覚的プレースホルダ（未使用化）
let dragByHandle = false; // ハンドルからのドラッグのみ許可
let hasPendingDrop = false; // ドロップが発生し、ドラッグ終了時に反映すべきか

function handleDragStart(e) {
  // カード全体からのドラッグを許可（ラベル/SVG以外）
  const target = e.target;
  const planetCard = e.currentTarget;
  
  // ラベルやSVGの内部から開始されたドラッグのみ拒否
  // ラベル/SVGにはpointer-events: noneが設定されているので通常は発生しないが、念のため
  const isLabelOrSvg = target.closest('.label') || target.closest('svg');
  
  // ラベル/SVGから開始で、かつフラグが立っていない場合のみ拒否
  // それ以外は全て許可（カード全体からドラッグ可能）
  // フラグが立っていれば、ラベル/SVGからでも許可（mousedownで許可された）
  if (isLabelOrSvg && !dragByHandle) {
    e.preventDefault();
    return;
  }
  
  // カード全体からドラッグ可能（ラベル/SVG以外）
  // フラグが立っている場合は、ラベル/SVGからでも許可
  // 基本的に全て許可する方向（位置やサイズに関係なく）
  draggedItem = planetCard;
  draggedItem.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  try { e.dataTransfer.setData("text/plain", "planet"); } catch(_) {}
  
  // フラグをリセット（次回のために）
  dragByHandle = false;
  // タイムアウトもクリア
  if (window._dragHandleTimeout) {
    clearTimeout(window._dragHandleTimeout);
    window._dragHandleTimeout = null;
  }
  // 現在位置を除外したドロップゾーンを再構築
  // ドラッグ中はドロップゾーンをワイド化するクラスを先に追加
  document.body.classList.add('dragging-dnd');
  // クラス追加後に再配置（レイアウト再計算を確実にする）
  requestAnimationFrame(() => {
    updateDropZones();
  });
  hasPendingDrop = false;
}

function handleDragEnd() {
  if (draggedItem) {
    draggedItem.classList.remove("dragging");
    // ドロップが行われていたら、プレースホルダ位置へ最終配置
    if (hasPendingDrop && placeholderEl && placeholderEl.parentNode) {
      const parent = placeholderEl.parentNode;
      parent.insertBefore(draggedItem, placeholderEl);
    }
  }
  draggedItem = null;
  dragByHandle = false;
  removePlaceholder();
  // ドラッグ終了クラスを削除
  document.body.classList.remove('dragging-dnd');
  // ドロップゾーンをすべて削除（通常時は不要）
  const comparisonArea = document.getElementById("comparisonArea");
  const oldZones = comparisonArea.querySelectorAll(".drop-zone");
  oldZones.forEach(zone => zone.remove());
  hasPendingDrop = false;
}

function ensurePlaceholder() { return null; }
function removePlaceholder() {}

/**
 * drop-zone を生成する関数
 */
function createDropZone(insertBeforePlanet = null) {
  const zone = document.createElement("div");
  zone.className = "drop-zone";
  // 挿入位置のカード要素を直接保存（より確実）
  if (insertBeforePlanet) {
    zone._insertBeforePlanet = insertBeforePlanet;
  }
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });
  zone.addEventListener("dragenter", () => {
    zone.classList.add("active");
  });
  zone.addEventListener("dragleave", () => {
    zone.classList.remove("active");
  });
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    zone.classList.remove("active");
    if (draggedItem) {
      const comparisonArea = document.getElementById("comparisonArea");
      const planets = Array.from(comparisonArea.querySelectorAll(".planet"));
      
      // ドロップゾーンの位置情報から挿入位置を決定
      let insertBeforePlanet = zone._insertBeforePlanet || null;
      
      // 保存されたカード要素がまだ有効か確認（DOMに存在するか）
      if (insertBeforePlanet && !insertBeforePlanet.parentNode) {
        insertBeforePlanet = null;
      }
      
      // 位置情報がない場合、ドロップゾーンの位置から計算
      if (!insertBeforePlanet) {
        const zoneRect = zone.getBoundingClientRect();
        const zoneCenterX = zoneRect.left + zoneRect.width / 2;
        
        // すべてのカードの位置を確認して、最も近い位置を探す
        for (let i = 0; i < planets.length; i++) {
          const planet = planets[i];
          if (planet === draggedItem) continue; // ドラッグ中のカードは除外
          
          const planetRect = planet.getBoundingClientRect();
          const planetCenterX = planetRect.left + planetRect.width / 2;
          
          // ドロップゾーンの中心がカードの左側にある場合、そのカードの前に挿入
          if (zoneCenterX < planetCenterX) {
            insertBeforePlanet = planet;
            break;
          }
        }
      }
      
      // 挿入位置が決定できた場合
      if (insertBeforePlanet && insertBeforePlanet.parentNode) {
        insertBeforePlanet.parentNode.insertBefore(draggedItem, insertBeforePlanet);
      } else {
        // 挿入位置が決定できない場合（末尾に追加）
        comparisonArea.appendChild(draggedItem);
      }
      
      // 視覚フィードバック
      draggedItem.animate([
        { transform: 'scale(0.98)', offset: 0 },
        { transform: 'scale(1)', offset: 1 }
      ], { duration: 160, easing: 'ease-out' });
      // 後処理はhandleDragEndで行う（ドロップゾーンの削除など）
      hasPendingDrop = false;
    }
  });
  return zone;
}

/**
 * 現在の星の並びに応じて drop-zone を再配置する関数
 * 既存のgapスペースに重ねて表示するため、絶対配置を使用
 */
function updateDropZones() {
  const comparisonArea = document.getElementById("comparisonArea");

  // 既存の drop-zone をすべて削除
  const oldZones = comparisonArea.querySelectorAll(".drop-zone");
  oldZones.forEach(zone => zone.remove());

  // 現在の .planet 要素を取得
  const planets = Array.from(comparisonArea.querySelectorAll(".planet"));
  const draggedIndex = draggedItem ? planets.indexOf(draggedItem) : -1;

  // 各カードの位置を計算して、その間にドロップゾーンを配置
  planets.forEach((planet, index) => {
    // ドラッグ中のカードはスキップ
    if (index === draggedIndex) return;

    const planetRect = planet.getBoundingClientRect();
    const areaRect = comparisonArea.getBoundingClientRect();
    
    // カードの相対位置を計算
    const relativeLeft = planetRect.left - areaRect.left;
    const relativeTop = planetRect.top - areaRect.top;
    const planetHeight = planetRect.height;

    // 先頭のカードの左側にドロップゾーン
    if (index === 0 && draggedIndex !== 0) {
      const zone = createDropZone(planet); // このカードの前に挿入
      comparisonArea.appendChild(zone);
      // gapスペースの半分（10px）を左側に配置
      zone.style.left = `${relativeLeft - 10}px`;
      zone.style.top = `${relativeTop + (planetHeight - 120) / 2}px`;
    }

    // カードの右側（次のカードとの間）にドロップゾーン
    if (index < planets.length - 1) {
      const nextPlanet = planets[index + 1];
      // ドラッグ対象の直前・直後はスキップ
      if (draggedIndex === index || draggedIndex === index + 1) return;
      
      const nextRect = nextPlanet.getBoundingClientRect();
      const zone = createDropZone(nextPlanet); // 次のカードの前に挿入
      comparisonArea.appendChild(zone);
      // 2つのカードの間の中央（gapスペースの中央）に配置
      const gapCenter = (nextRect.left - areaRect.left + relativeLeft + planetRect.width) / 2;
      zone.style.left = `${gapCenter - 10}px`; // 幅20pxの中央
      zone.style.top = `${relativeTop + (planetHeight - 120) / 2}px`;
    }
  });

  // 末尾のカードの右側にドロップゾーン
  if (planets.length > 0 && draggedIndex !== planets.length - 1) {
    const lastPlanet = planets[planets.length - 1];
    const lastRect = lastPlanet.getBoundingClientRect();
    const areaRect = comparisonArea.getBoundingClientRect();
    const relativeLeft = lastRect.left - areaRect.left;
    const relativeTop = lastRect.top - areaRect.top;
    const planetHeight = lastRect.height;
    
    // 末尾に挿入（insertBeforeIndexはnullで、末尾に追加される）
    const zone = createDropZone(null);
    comparisonArea.appendChild(zone);
    // gapスペースの半分（10px）を右側に配置
    zone.style.left = `${relativeLeft + lastRect.width + 10}px`;
    zone.style.top = `${relativeTop + (planetHeight - 120) / 2}px`;
  }
}