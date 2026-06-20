import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent state updates on unmounted components
    let isMounted = true; 

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include' // CRITICAL: Mandates browser to send httpOnly cookies
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || `HTTP Error: ${response.status}`);
        }

        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    }

    return () => {
      isMounted = false; // Cleanup loop to eliminate React memory leaks
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;