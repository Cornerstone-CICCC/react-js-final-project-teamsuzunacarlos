const Footer = () => {
  return (
    <footer
      style={{
        height: "50px",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        color: "#888",
        fontSize: "12px",
      }}
    >
      &copy; {new Date().getFullYear()} ItSocks. All rights reserved.
    </footer>
  );
};

export default Footer;
