// 星データ（直径: km, 質量: kg, 距離: km または 光年）
window.starData = {
  solar: {
    "水星": { diameter: 4879, mass: 3.3e23, distanceKm: 91700000 },
    "金星": { diameter: 12104, mass: 4.87e24, distanceKm: 41400000 },
    "地球": { diameter: 12742, mass: 5.97e24, distanceKm: 0 },
    "火星": { diameter: 6779, mass: 6.42e23, distanceKm: 78300000 },
    "木星": { diameter: 139820, mass: 1.90e27, distanceKm: 628000000 },
    "土星": { diameter: 116460, mass: 5.68e26, distanceKm: 1275000000 },
    "天王星": { diameter: 50724, mass: 8.68e25, distanceKm: 2720000000 },
    "海王星": { diameter: 49244, mass: 1.02e26, distanceKm: 4350000000 },
    "冥王星": { diameter: 2376, mass: 1.31e22, distanceKm: 5900000000 }
  },
  exoplanet: {
    "Kepler-22b": { diameter: 28000, mass: 2.4e25, distanceLy: 600 },
    "WASP-12b": { diameter: 180000, mass: 1.4e27, distanceLy: 1400 },
    "HD 209458 b": { diameter: 143000, mass: 0.69e27, distanceLy: 150 }
  },
  star: {
    "太陽": { diameter: 1392000, mass: 1.989e30, distanceKm: 149600000 },
    "ベテルギウス": { diameter: 887000000, mass: 2.0e31, distanceLy: 642 },
    "Stephenson 2-18": { diameter: 2150000000, mass: 3.0e31, distanceLy: 19000 },
    "リゲル": { diameter: 78900000, mass: 3.5e31, distanceLy: 860 }
  }
};