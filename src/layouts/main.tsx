import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";

type Props = {
  children?: React.ReactNode;
};

const MainLayout: React.FunctionComponent<Props> = (props) => {
  return (
    <div>
      <header>
        <Navbar variant="dark" bg="dark" className="shadow">
          <Link href="/" passHref>
            <Navbar.Brand>AtCoder Editorials</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mr-auto"></Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <main style={{ background: "#f5f5f5" }}>
        <Container className="shadow bg-white py-4">{props.children}</Container>
        <hr className="my-4" />
      </main>
      <footer>
        <Nav></Nav>
      </footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
