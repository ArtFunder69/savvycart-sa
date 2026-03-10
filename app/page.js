'use client';
import { useState, useEffect } from "react";

const RETAILERS = {
  checkers: { name: "Checkers Sixty60", color: "#e31837" },
  pnp: { name: "Pick n Pay", color: "#e6007e" },
  woolworths: { name: "Woolworths", color: "#3d8c40" },
  spar: { name: "SPAR", color: "#007a3d" },
  makro: { name: "Makro", color: "#003087" },
  dischem: { name: "Dis-Chem", color: "#0077c8" },
  clicks: { name: "Clicks", color: "#e4002b" },
  takealot: { name: "Takealot", color: "#1b2a4a" },
};

const PRODUCTS = [
  {
    id: 1, name: "Clover Full Cream Milk 2L", category: "Dairy", image: "🥛",
    prices: [
      { retailer: "checkers", price: 39.99, inStock: true, delivery: "Same Day" },
      { retailer: "pnp", price: 41.99, inStock: true, delivery: "Next Day" },
      { retailer: "woolworths", price: 44.99, inStock: true, delivery: "Same Day" },
      { retailer: "makro", price: 37.50, inStock: true, delivery: "2-3 Days", deal: "Promo" },
    ],
  },
  {
    id: 2, name: "Albany Superior White Bread 700g", category: "Bakery", image: "🍞",
    prices: [
      { retailer: "checkers", price: 19.99, inStock: true, delivery: "Same Day" },
      { retailer: "pnp", price: 18.99, inStock: true, delivery: "Next Day", deal: "Sale" },
      { retailer: "woolworths", price: 24.99, inStock: true, delivery: "Same Day" },
      { retailer: "makro", price: 17.50, inStock: true, delivery: "2-3 Days" },
    ],
  },
  {
    id: 3, name: "Ariel Washing Powder 2kg", category: "Laundry", image: "🧺",
    prices: [
      { retailer: "checkers", price: 149.99, inStock: true, delivery: "Same Day" },
      { retailer: "pnp", price: 159.99, inStock: true, delivery: "Next Day" },
      { retailer: "makro", price: 129.00, inStock: true, delivery: "2-3 Days", deal: "Promo" },
      { retailer: "takealot", price: 135.00, inStock: true, delivery: "3-5 Days" },
    ],
  },
  {
    id: 4, name: "Colgate Total Toothpaste 75ml", category: "Toiletries", image: "🪥",
    prices: [
      { retailer: "clicks", price: 49.99, inStock: true, delivery: "2-3 Days", deal: "2for1" },
      { retailer: "dischem", price: 52.99, inStock: true, delivery: "2-3 Days" },
      { retailer: "checkers", price: 54.99, inStock: true, delivery: "Same Day" },
      { retailer: "pnp", price: 53.99, inStock: true, delivery: "Next Day" },
    ],
  },
  {
    id: 5, name: "Nescafé Gold 200g", category: "Beverages", image: "☕",
    prices: [
      { retailer: "checkers", price: 129.99, inStock: true, delivery: "Same Day" },
      { retailer: "makro", price: 119.00, inStock: true, delivery: "2-3 Days", deal: "Promo" },
      { retailer: "woolworths", price: 139.99, inStock: true, delivery: "Same Day" },
      { retailer: "takealot", price: 124.99, inStock: true, delivery: "3-5 Days" },
    ],
  },
  {
    id: 6, name: "Pampers Baby Dry Size 3 (52 count)", category: "Baby", image: "👶",
    prices: [
      { retailer: "clicks", price: 209.99, inStock: true, delivery: "2-3 Days", deal: "Sale" },
      { retailer: "dischem", price: 214.99, inStock: true, delivery: "2-3 Days" },
      { retailer: "checkers", price: 219.99, inStock: true, delivery: "Same Day" },
      { retailer: "takealot", price: 199.99, inStock: true, delivery: "3-5 Days", deal: "Promo" },
    ],
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [basket, setBasket] = useState([]);
  const [page, setPage] = useState("home");

  useEffect(() => {
    if (query.length > 1) {
      setResults(PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  }, [query]);

  const getLowest = (product) => {
    const inStock = product.prices.filter(p => p.inStock);
    return inStock.reduce((min, p) => p.price < min.price ? p : min, inStock[0]);
  };

  const addToBasket = (product) => {
    if (!basket.find(b => b.id === product.id)) {
      setBasket(prev => [...prev, product]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "sans-serif" }}>

      {/* NAV */}
      <nav style={{ background: "white", borderBottom: "2px solid #dcfce7", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", fontWeight: 900, fontSize: 22, color: "#15803d" }}>
          🛒 SavvyCart <span style={{ color: "#22c55e" }}>SA</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["home","Home"],["search","Search"],["basket","Basket"]].map(([p,l]) => (
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

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#14532d", marginBottom: 20 }}>🛒 Popular Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {PRODUCTS.map(product => {
                const lowest = getLowest(product);
                const inBasket = basket.find(b => b.id === product.id);
                return (
                  <div key={product.id} style={{ background: "white", borderRadius: 16, border: "1px solid #dcfce7", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div onClick={() => { setSelected(product); setPage("product"); }} style={{ padding: 20, cursor: "pointer" }}>
                      <div style={{ fontSize: 48 }}>{product.image}</div>
                      <div style={{ fontSize: 12, color: "#15803d", fontWeight: 600, marginTop: 8 }}>{product.category}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, lineHeight: 1.3 }}>{product.name}</div>
                      <div style={{ marginTop: 10 }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: "#15803d" }}>R{lowest.price}</span>
                        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>at {RETAILERS[lowest.retailer].name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{product.prices.length} stores compared</div>
                    </div>
                    <div style={{ borderTop: "1px solid #f0fdf4", padding: "10px 16px", display: "flex", gap: 8 }}>
                      <button onClick={() => addToBasket(product)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", background: inBasket ? "#f0fdf4" : "#15803d", color: inBasket ? "#15803d" : "white", fontWeight: 600, fontSize: 13 }}>
                        {inBasket ? "✓ In Basket" : "+ Add to Basket"}
                      </button>
                      <button onClick={() => { setSelected(product); setPage("product"); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #bbf7d0", cursor: "pointer", background: "white", color: "#15803d", fontWeight: 600, fontSize: 13 }}>
                        Compare
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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
                const lowest = getLowest(product);
                const sorted = [...product.prices].sort((a,b) => a.price - b.price);
                const inBasket = basket.find(b => b.id === product.id);
                return (
                  <div key={product.id} style={{ background: "white", borderRadius: 16, border: "1px solid #dcfce7", display: "flex", flexWrap: "wrap" }}>
                    <div onClick={() => { setSelected(product); setPage("product"); }} style={{ width: 100, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, cursor: "pointer", borderRadius: "16px 0 0 16px" }}>
                      {product.image}
                    </div>
                    <div style={{ flex: 1, padding: "16px 20px", minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{product.name}</div>
                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {sorted.slice(0,3).map((p, i) => (
                          <span key={i} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: i === 0 ? "#dcfce7" : "#f9fafb", color: i === 0 ? "#15803d" : "#374151", border: `1px solid ${i === 0 ? "#86efac" : "#e5e7eb"}` }}>
                            {i === 0 && "✓ "}{RETAILERS[p.retailer].name}: R{p.price}
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 14 }}>
                        Lowest: <strong style={{ color: "#15803d", fontSize: 18 }}>R{lowest.price}</strong>
                        <span style={{ color: "#6b7280", marginLeft: 8 }}>at {RETAILERS[lowest.retailer].name}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16, justifyContent: "center" }}>
                      <button onClick={() => addToBasket(product)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: inBasket ? "#f0fdf4" : "#15803d", color: inBasket ? "#15803d" : "white", fontWeight: 600, fontSize: 13 }}>
                        {inBasket ? "✓ Added" : "+ Basket"}
                      </button>
                      <button onClick={() => { setSelected(product); setPage("product"); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #bbf7d0", cursor: "pointer", background: "white", color: "#15803d", fontWeight: 600, fontSize: 13 }}>
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

      {/* PRODUCT PAGE */}
      {page === "product" && selected && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <button onClick={() => setPage("search")} style={{ background: "#f0fdf4", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 8, marginBottom: 20, fontWeight: 600, color: "#374151" }}>← Back</button>
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
                {[...selected.prices].sort((a,b)=>a.price-b.price).map((p, i) => {
                  const isLow = i === 0;
                  return (
                    <tr key={i} style={{ background: isLow ? "#f0fdf4" : "white", borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 600 }}>{RETAILERS[p.retailer].name}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: isLow ? 20 : 16, fontWeight: isLow ? 900 : 600, color: isLow ? "#15803d" : "#374151" }}>R{p.price}</span>
                        {isLow && <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>BEST PRICE</div>}
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
                  );
                })}
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
              {basket.map(product => {
                const lowest = getLowest(product);
                return (
                  <div key={product.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f9fafb", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 32 }}>{product.image}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{product.name}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>Best price: <strong style={{ color: "#15803d" }}>R{lowest.price}</strong> at {RETAILERS[lowest.retailer].name}</div>
                    </div>
                    <button onClick={() => setBasket(prev => prev.filter(b => b.id !== product.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 20 }}>×</button>
                  </div>
                );
              })}
              <div style={{ padding: 20, background: "#f0fdf4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Total (best prices)</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#15803d" }}>R{basket.reduce((sum, p) => sum + getLowest(p).price, 0).toFixed(2)}</div>
                </div>
                <button style={{ padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: "#15803d", color: "white", fontWeight: 700, fontSize: 15 }}>Checkout →</button>
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