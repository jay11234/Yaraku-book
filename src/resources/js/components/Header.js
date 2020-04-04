import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

const Header = () => (
    <Navbar color="dark" light expand="md">
        <div className="container">
            <Link className="navbar-brand" to="/home">
                <p style={{ color: "#fff", fontStyle: "bold" }}>
                    Yaraku Book Store
                </p>
            </Link>
        </div>
    </Navbar>
);

export default Header;
