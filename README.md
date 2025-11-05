# 星サイズを比較するビジュアライザーです / Cosmic Size Comparison Visualizer

## 概要

- 地球を基準にして太陽系惑星・系外惑星・恒星のサイズと質量を視覚的に比較できます。
- 星はアニメーション付きで表示され、カテゴリごとに色分けされます。
- 図は星サイズの大小の相対性を示すものであり、直径を正確に描画するものではありません。

### 特徴
- 地球との相対サイズと質量を表示（倍率付き）
- 鼓動・回転アニメーション付きの円形表示
- カテゴリ別グラデーション（惑星・恒星など）
- 星の描画は `planet.js`, UI操作は `ui.js`, アニメーション処理は `animation.js` に記述
- 個別の星データは `stars.js` で管理

### ファイル構成
index.html style.css stars.js planet.js ui.js animation.js


### 使用方法
1. `index.html` をブラウザで開く
2. カテゴリを選択し、星を追加して比較
3. 「すべてクリア」で地球のみの表示に戻る

---

## Overview

This is a visualizer that compares the size and mass of planets and stars relative to Earth. Each celestial body is animated and color-coded by category. 
This is a relative representation of the size, not an exact size.

### Features
- Displays diameter and mass relative to Earth
- Animated pulsating and rotating circles
- Gradient coloring by category (planet, star, etc.)
- Modular code split into `planet.js`, `ui.js`, `animation.js`
- Star data managed in `stars.js`

### File Structure
index.html style.css stars.js planet.js ui.js animation.js


### How to Use
1. Open `index.html` in your browser
2. Select a category and add stars to compare
3. Click "Clear All" to reset to Earth-only view
