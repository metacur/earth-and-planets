/**
 * イージング関数：easeOutQuad（自然な膨らみ方）
 * @param {number} t - 0〜1の進行度
 * @returns {number} - イージング後の倍率
 */
function easeOutQuad(t) {
  return t * (2 - t);
}

/**
 * 星のSVGサイズをアニメーションで膨らませる関数
 * @param {SVGElement} svg - SVG要素
 * @param {SVGCircleElement} circle - 円要素
 * @param {number} finalSize - 最終サイズ(px)
 */
function animateGrowth(svg, circle, finalSize) {
  let frame = 0;
  const steps = 30; // アニメーションのステップ数（滑らかさ）

  function grow() {
    const progress = frame / steps;
    const size = 5 + (finalSize - 5) * easeOutQuad(progress);

    // SVGと円のサイズを更新
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    circle.setAttribute("cx", size / 2);
    circle.setAttribute("cy", size / 2);
    circle.setAttribute("r", size / 2);

    frame++;
    if (frame <= steps) {
      requestAnimationFrame(grow); // 次のフレームへ
    }
  }

  grow(); // アニメーション開始
}