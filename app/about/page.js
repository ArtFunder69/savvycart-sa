export const metadata = {
  title: "About SavvyCart SA - South Africa's Grocery Price Comparison",
  description: "SavvyCart SA helps South Africans compare grocery prices across major retailers to save money every day.",
};

export default function About() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", fontFamily: "Arial, sans-serif", lineHeight: "1.7", color: "#333" }}>
      <h1 style={{ color: "#15803d", borderBottom: "3px solid #22c55e", paddingBottom: "12px" }}>About SavvyCart SA</h1>
      
      <p style={{ fontSize: "18px", color: "#374151" }}>SavvyCart SA is South Africa's dedicated grocery price comparison platform, helping everyday South Africans save money on their weekly shopping.</p>

      <h2 style={{ color: "#14532d", marginTop: "32px" }}>Our Mission</h2>
      <p>With the rising cost of living in South Africa, every rand counts. Our mission is simple — help you find the cheapest price for your everyday groceries, toiletries, and household products across all major South African retailers.</p>

      <h2 style={{ color: "#14532d", marginTop: "32px" }}>What We Do</h2>
      <p>We compare prices across South Africa's biggest retailers including:</p>
      <ul>
        <li>Takealot</li>
        <li>Checkers & Checkers Sixty60</li>
        <li>Pick n Pay</li>
        <li>Woolworths</li>
        <li>Makro</li>
        <li>Dis-Chem</li>
        <li>Clicks</li>
      </ul>
      <p>Our system automatically tracks prices daily so you always see the most up to date deals.</p>

      <h2 style={{ color: "#14532d", marginTop: "32px" }}>Why SavvyCart SA?</h2>
      <ul>
        <li>🇿🇦 Built specifically for South African shoppers</li>
        <li>💰 Find the lowest price instantly</li>
        <li>🛒 Compare multiple retailers at once</li>
        <li>📱 Works on any device</li>
        <li>🆓 Completely free to use</li>
      </ul>

      <h2 style={{ color: "#14532d", marginTop: "32px" }}>Contact Us</h2>
      <p>Have a suggestion or found an issue? We'd love to hear from you at <strong>hello@savvycart.co.za</strong></p>
    </main>
  );
}