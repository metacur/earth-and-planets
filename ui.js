document.addEventListener("DOMContentLoaded", () => {
  // DOM要素の取得
  const categorySelect = document.getElementById("categorySelect");
  const objectSelect = document.getElementById("objectSelect");
  const addButton = document.getElementById("addButton");
  const clearButton = document.getElementById("clearButton");
  const comparisonArea = document.getElementById("comparisonArea");

  // 星データを取得
  const starData = window.starData;

  // 初期表示：地球を描画
  animatePlanet("地球", 12742, 5.97e24, "earth");

  // カテゴリ変更時に星の選択肢を更新
categorySelect.addEventListener("change", () => {
  const category = categorySelect.value;
  console.log("選択されたカテゴリ:", category); 

  const stars = window.starData?.[category];
  if (!stars) {
    objectSelect.innerHTML = "<option>（データなし）</option>";
    return;
  }

  objectSelect.innerHTML = "";
  Object.keys(stars).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    objectSelect.appendChild(option);
  });
});


  categorySelect.dispatchEvent(new Event("change")); // 初期化

  // 「追加して比較」ボタンの処理
  addButton.addEventListener("click", () => {
    const category = categorySelect.value;
    const name = objectSelect.value;
    const { diameter, mass } = starData[category][name];
    animatePlanet(name, diameter, mass, category);
  });

  // 「すべてクリア」ボタンの処理
  clearButton.addEventListener("click", () => {
    comparisonArea.innerHTML = "";
    animatePlanet("地球", 12742, 5.97e24, "earth");
  });
});
