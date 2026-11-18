import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Fetches the product catalogue from the Supabase "products" table.
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevents state updates if the component unmounts before the request finishes
    let ignore = false;

    const fetchProducts = async () => {
      if (!supabase) {
        setError('The store is not configured yet. Please add Supabase credentials to .env.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase.from('products').select('*');
        if (ignore) return;

        if (fetchError) throw fetchError;
        setProducts(data ?? []);
      } catch (err) {
        if (ignore) return;
        console.error(err);
        setError('Could not load products. Please try again later.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      ignore = true;
    };
  }, []);

  return { products, loading, error };
};
