import React from "react";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

function Contact(props) {
  return (
    <div className="container">
      <Header />
      <h2>My contact</h2>

      <div>
        <b>Mannheim</b>
      </div>
      <div>
        <b>68300</b>
      </div>
      <div>0163 123 45 678</div>
      <Footer />
    </div>
  );
}

export default Contact;
