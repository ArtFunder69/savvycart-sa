'use client';
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [basket, setBasket] = useState([]);
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, products]);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (!error) {
      setProducts(data);
      await loadDeals(data);
    }
    setLoading(false);
  };

  const loadDeals = async (productList) => {
    const { data, error } = await supabase
      .from('prices')
      .select('*, retailers(*), products(*)')
      .eq('in_stock', true)
      .order('price');
    if (!error && data) {
      const seen = new Set();
      const bestDeals = [];
      for (const price of data) {
        if (!seen.has(price.product_id)) {
          seen.add(price.product_id);
          const product = productList.find(p => p.id === price.product_id);
          if (product) {
            bestDeals.push({
              product: product,
              price: price.price,
              retailer: price.retailers?.name,
              delivery: price.delivery,
            });
          }
        }
        if (bestDeals.length >= 24) break;
      }
      setDeals(bestDeals);
    }
  };

  const loadProductPrices = async (product) => {
    const { data, error } = await supabase
      .from('prices')
      .select('*, retailers(*)')
      .eq('product_id', product.id)
      .order('price');
    if (!error) setSelectedPrices(data);
    setSelected(product);
    setPage("product");
  };

  const addToBasket = (product) => {
    if (!basket.find(b => b.id === product.id)) {
      setBasket(prev => [...prev, product]);
    }
  };

  const removeFromBasket = (id) => {
    setBasket(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "sans-serif" }}>

      {/* NAV */}
      <nav style={{ background: "white", borderBottom: "2px solid #dcfce7", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", fontWeight: 900, fontSize: 22, color: "#15803d" }}>
          🛒 SavvyCart <span style={{ color: "#22c55e" }}>SA</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["home","Home"],["search","Search"],["deals","🔥 Deals"],["basket","Basket"]].map(([p,l]) => (
            <button key={p} onClick={() => setPage(p)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: page === p ? "#dcfce7" : "transparent", color: page === p ? "#15803d" : "#4b5563", fontWeight: 600 }}>
              {l} {p === "basket" && basket.length > 0 && `(${basket.length})`}
            </button>
          ))}
        </div>
      </nav>

      {/* HOME PAGE */}
      {page === "home" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, #15803d, #22c55e)", padding: "64px 24px", textAlign: "center" }}>
            <h1 style={{ fontSize: 42, fontWeight: 900, color: "white", margin: "0 0 12px" }}>Stop Overpaying for Groceries</h1>
            <p style={{ color: "#bbf7d0", fontSize: 18, marginBottom: 32 }}>Compare prices across Checkers, Pick n Pay, Woolworths, Makro & more</p>
            <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setPage("search"); }}
                placeholder="Search milk, bread, washing powder..."
                style={{ flex: 1, padding: "16px 20px", border: "none", outline: "none", fontSize: 16 }}
              />
              <button onClick={() => setPage("search")} style={{ padding: "16px 24px", background: "#15803d", color: "white", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>
                Search 🔍
              </button>
            </div>
          </div>

          {/* DEALS PREVIEW ON HOME */}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#14532d" }}>🔥 Today's Best Deals</h2>
              <button onClick={() => setPage("deals")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: "#15803d", color: "white", fontWeight: 600 }}>See All →</button>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>⏳ Loading deals...</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
                {deals.slice(0, 4).map((deal, i) => (
                  <div key={i} onClick={() => loadProductPrices(deal.product)} style={{ background: "white", borderRadius: 16, border: "2px solid #dcfce7", padding: 20, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 40 }}>{deal.product.image}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8, lineHeight: 1.3 }}>{deal.product.name}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#15803d", marginTop: 8 }}>R{deal.price}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>at {deal.retailer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ALL PRODUCTS */}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#14532d", marginBottom: 20 }}>🛒 All Products</h2>
            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
                <div style={{ fontSize: 48 }}>⏳</div>
                <div style={{ marginTop: 12, fontSize: 18 }}>Loading products...</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {products.map(product => {
                  const inBasket = basket.find(b => b.id === product.id);
                  return (
                    <div key={product.id} style={{ background: "white", borderRadius: 16, border: "1px solid #dcfce7", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div onClick={() => loadProductPrices(product)} style={{ padding: 20, cursor: "pointer" }}>
                        <div style={{ fontSize: 48 }}>{product.image}</div>
                        <div style={{ fontSize: 12, color: "#15803d", fontWeight: 600, marginTop: 8 }}>{product.category}</div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, lineHeight: 1.3 }}>{product.name}</div>
                        <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>Click to compare prices →</div>
                      </div>
                      <div style={{ borderTop: "1px solid #f0fdf4", padding: "10px 16px", display: "flex", gap: 8 }}>
                        <button onClick={() => addToBasket(product)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", background: inBasket ? "#f0fdf4" : "#15803d", color: inBasket ? "#15803d" : "white", fontWeight: 600, fontSize: 13 }}>
                          {inBasket ? "✓ In Basket" : "+ Add to Basket"}
                        </button>
                        <button onClick={() => loadProductPrices(product)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #bbf7d0", cursor: "pointer", background: "white", color: "#15803d", fontWeight: 600, fontSize: 13 }}>
                          Compare
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH PAGE */}
      {page === "search" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: "14px 20px", border: "none", outline: "none", fontSize: 16 }} />
          </div>
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>{results.length} results for "<strong>{query}</strong>"</div>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <div style={{ fontSize: 18, marginTop: 12 }}>Try searching for milk, bread or toothpaste</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map(product => {
                const inBasket = basket.find(b => b.id === product.id);
                return (
                  <div key={product.id} style={{ background: "white", borderRadius: 16, border: "1px solid #dcfce7", display: "flex", flexWrap: "wrap" }}>
                    <div onClick={() => loadProductPrices(product)} style={{ width: 100, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, cursor: "pointer", borderRadius: "16px 0 0 16px" }}>
                      {product.image}
                    </div>
                    <div style={{ flex: 1, padding: "16px 20px", minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{product.name}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{product.category}</div>
                      <div style={{ fontSize: 13, color: "#15803d", marginTop: 8, fontWeight: 600 }}>Click Compare to see all prices →</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16, justifyContent: "center" }}>
                      <button onClick={() => addToBasket(product)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: inBasket ? "#f0fdf4" : "#15803d", color: inBasket ? "#15803d" : "white", fontWeight: 600, fontSize: 13 }}>
                        {inBasket ? "✓ Added" : "+ Basket"}
                      </button>
                      <button onClick={() => loadProductPrices(product)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #bbf7d0", cursor: "pointer", background: "white", color: "#15803d", fontWeight: 600, fontSize: 13 }}>
                        Compare
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DEALS PAGE */}
      {page === "deals" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#14532d", marginBottom: 8 }}>🔥 Today's Best Deals</h2>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>Lowest prices we've found across all retailers today</p>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
              <div style={{ fontSize: 48 }}>⏳</div>
              <div style={{ marginTop: 12, fontSize: 18 }}>Loading deals...</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {deals.map((deal, i) => (
                <div key={i} onClick={() => loadProductPrices(deal.product)} style={{ background: "white", borderRadius: 16, border: "2px solid #dcfce7", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 48 }}>{deal.product.image}</span>
                    <div>
                      <div style={{ fontSize: 11, color: "#15803d", fontWeight: 700, textTransform: "uppercase" }}>{deal.product.category}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2, lineHeight: 1.3 }}>{deal.product.name}</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "#15803d" }}>R{deal.price}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>at {deal.retailer}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>BEST PRICE</span>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{deal.delivery}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRODUCT PAGE */}
      {page === "product" && selected && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <button onClick={() => setPage("home")} style={{ background: "#f0fdf4", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 8, marginBottom: 20, fontWeight: 600, color: "#374151" }}>← Back</button>
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #dcfce7", overflow: "hidden" }}>
            <div style={{ padding: 24, borderBottom: "1px solid #f0fdf4", display: "flex", gap: 20, alignItems: "center" }}>
              <span style={{ fontSize: 64 }}>{selected.image}</span>
              <div>
                <div style={{ fontSize: 11, color: "#15803d", fontWeight: 700, textTransform: "uppercase" }}>{selected.category}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{selected.name}</div>
                <button onClick={() => addToBasket(selected)} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: basket.find(b=>b.id===selected.id) ? "#f0fdf4" : "#15803d", color: basket.find(b=>b.id===selected.id) ? "#15803d" : "white", fontWeight: 700 }}>
                  {basket.find(b=>b.id===selected.id) ? "✓ In Basket" : "+ Add to Basket"}
                </button>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Store","Price","Delivery","Deal",""].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: 12, color: "#6b7280", textTransform: "uppercase", borderBottom: "2px solid #f0fdf4" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedPrices.map((p, i) => (
                  <tr key={i} style={{ background: i === 0 ? "#f0fdf4" : "white", borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>{p.retailers?.name}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: i === 0 ? 20 : 16, fontWeight: i === 0 ? 900 : 600, color: i === 0 ? "#15803d" : "#374151" }}>R{p.price}</span>
                      {i === 0 && <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>BEST PRICE</div>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: p.delivery === "Same Day" ? "#dcfce7" : "#f3f4f6", color: p.delivery === "Same Day" ? "#15803d" : "#6b7280", fontWeight: 600 }}>{p.delivery}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {p.deal && <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>{p.deal}</span>}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: "#15803d", color: "white", fontWeight: 600, fontSize: 13 }}>Buy →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BASKET PAGE */}
      {page === "basket" && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#14532d", marginBottom: 20 }}>🧺 Your Basket</h2>
          {basket.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 16, border: "1px solid #dcfce7" }}>
              <div style={{ fontSize: 48 }}>🛒</div>
              <div style={{ fontSize: 18, marginTop: 12, fontWeight: 700 }}>Your basket is empty</div>
              <button onClick={() => setPage("home")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: "#15803d", color: "white", fontWeight: 700 }}>Browse Products</button>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #dcfce7", overflow: "hidden" }}>
              {basket.map(product => (
                <div key={product.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{product.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{product.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Click compare to see best price</div>
                  </div>
                  <button onClick={() => removeFromBasket(product.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 20 }}>×</button>
                </div>
              ))}
              <div style={{ padding: 20, background: "#f0fdf4" }}>
                <button onClick={() => loadProductPrices(basket[0])} style={{ width: "100%", padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: "#15803d", color: "white", fontWeight: 700, fontSize: 15 }}>
                  Compare All Prices →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#14532d", color: "#bbf7d0", padding: "24px", textAlign: "center", fontSize: 13, marginTop: 60 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "white", marginBottom: 6 }}>🛒 SavvyCart SA</div>
        <div>Helping South Africans save money, one grocery at a time</div>
      </footer>

    </div>
  );
}