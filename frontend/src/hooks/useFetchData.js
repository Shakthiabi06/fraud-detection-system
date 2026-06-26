import { useEffect, useState } from "react";
import { USE_LIVE_API } from "../services/api";

// Wraps a mock value and a live-fetch function, switching between them based
// on USE_LIVE_API (set in .env.local). Pages call this once per data source
// instead of importing straight from mock/sampleData.js — when the backend
// is confirmed ready, flipping VITE_USE_LIVE_API=true in .env.local is the
// only change needed; no page needs editing.
//
// Usage:
//   const { data, loading, error } = useFetchData(mockTransactions, getTransactions);
//
// `data` is `mockValue` immediately if USE_LIVE_API is false (no network
// call, no loading state — mock mode behaves exactly as it did before this
// hook existed). If USE_LIVE_API is true, `data` starts as `mockValue` (so
// the UI has something to render immediately) then updates once the real
// fetch resolves.
export function useFetchData(mockValue, liveFetchFn) {
  const [data, setData] = useState(mockValue);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!USE_LIVE_API) {
      setData(mockValue);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    liveFetchFn()
      .then((result) => {
        if (!isCancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          // Fall back to mock data on failure rather than leaving the UI
          // blank — a dropped connection to the backend shouldn't take
          // down the whole dashboard.
          setError(err);
          setData(mockValue);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
    // mockValue and liveFetchFn are expected to be stable references
    // (module-level mock arrays, module-level functions) — intentionally
    // not re-running this effect if a caller passes a new inline function
    // each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}