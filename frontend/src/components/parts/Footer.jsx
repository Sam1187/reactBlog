import React from "react";

function Footer(props) {
  return (
    <div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Built with Nodejs & MongoDb & React
      </footer>
    </div>
  );
}

export default Footer;
