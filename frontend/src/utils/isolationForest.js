// Isolation Forest, implemented from the original algorithm
// (Liu, Ting & Zhou, "Isolation Forest", ICDM 2008) — not a call to a
// library or to the backend's trained model. This runs entirely in the
// browser on whatever numeric feature vectors you give it.
//
// Core idea: anomalies are "few and different," so they tend to get
// isolated (separated into their own leaf) after fewer random splits than
// normal points do. Build many random trees, average how many splits it
// takes to isolate each point across all trees, and convert that into a
// 0-1 anomaly score using the path-length normalization from the paper.

// Average path length of an unsuccessful search in a Binary Search Tree —
// used to normalize raw path lengths into a comparable 0-1 anomaly score.
// This is the same c(n) formula from the original paper (harmonic-number
// approximation), not an arbitrary constant.
function averagePathLength(n) {
  if (n <= 1) return 0;
  const harmonicApprox = Math.log(n - 1) + 0.5772156649; // Euler-Mascheroni constant
  return 2 * harmonicApprox - (2 * (n - 1)) / n;
}

// Builds a single random isolation tree.
// Each internal node picks one random feature and one random split value
// strictly between that feature's min and max within the current subset,
// then partitions points into a left/right child. Recursion stops at
// maxDepth or when 1 (or 0) points remain — those are the isolating leaves.
function buildTree(points, currentDepth, maxDepth) {
  const n = points.length;

  if (currentDepth >= maxDepth || n <= 1) {
    return { isLeaf: true, size: n };
  }

  const numFeatures = points[0].length;
  const featureIndex = Math.floor(Math.random() * numFeatures);

  let min = Infinity;
  let max = -Infinity;
  for (const point of points) {
    const value = point[featureIndex];
    if (value < min) min = value;
    if (value > max) max = value;
  }

  // All points identical on this feature — can't split meaningfully,
  // treat as isolated here rather than looping forever.
  if (min === max) {
    return { isLeaf: true, size: n };
  }

  const splitValue = min + Math.random() * (max - min);

  const left = [];
  const right = [];
  for (const point of points) {
    if (point[featureIndex] < splitValue) left.push(point);
    else right.push(point);
  }

  return {
    isLeaf: false,
    featureIndex,
    splitValue,
    left: buildTree(left, currentDepth + 1, maxDepth),
    right: buildTree(right, currentDepth + 1, maxDepth),
  };
}

// Walks a single point down a built tree, returning the path length
// (number of splits) it took to isolate it, including the c(size)
// adjustment for whatever subtree size remained when isolation stopped
// early (matches the original paper's handling of unterminated branches).
function pathLength(point, node, currentDepth) {
  if (node.isLeaf) {
    return currentDepth + averagePathLength(node.size);
  }
  const branch = point[node.featureIndex] < node.splitValue ? node.left : node.right;
  return pathLength(point, branch, currentDepth + 1);
}

// Public API: trains numTrees isolation trees on `points` (array of
// numeric feature arrays, e.g. [[amount, hour], [amount, hour], ...]),
// each on a random sub-sample (subSampleSize), then scores every point in
// `points` by its average path length across all trees, converted to a
// 0-1 anomaly score via 2^(-avgPathLength / c(n)).
// Score close to 1 -> isolated quickly -> likely anomaly.
// Score close to 0.5 or below -> took many splits -> likely normal.
export function runIsolationForest(points, { numTrees = 100, subSampleSize = 256 } = {}) {
  const n = points.length;
  const effectiveSubSample = Math.min(subSampleSize, n);
  const maxDepth = Math.ceil(Math.log2(Math.max(effectiveSubSample, 2)));

  const trees = [];
  for (let i = 0; i < numTrees; i += 1) {
    const sample = [];
    for (let j = 0; j < effectiveSubSample; j += 1) {
      sample.push(points[Math.floor(Math.random() * n)]);
    }
    trees.push(buildTree(sample, 0, maxDepth));
  }

  const normalizer = averagePathLength(effectiveSubSample);

  return points.map((point) => {
    let totalPathLength = 0;
    for (const tree of trees) {
      totalPathLength += pathLength(point, tree, 0);
    }
    const avgPathLength = totalPathLength / numTrees;
    const anomalyScore = Math.pow(2, -avgPathLength / normalizer);
    return Math.round(anomalyScore * 1000) / 1000;
  });
}