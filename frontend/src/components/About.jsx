import React from "react";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

function About(props) {
  return (
    <div className="container">
      <Header />
      <h1>About</h1>

      <p>This is a test project on Node.js & React</p>

      <Footer />
    </div>
  );
}

export default About;
