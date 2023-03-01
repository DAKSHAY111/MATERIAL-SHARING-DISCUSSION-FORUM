import React from "react";
import { Button } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";

import "../style/Navbar.css";

import { useLogoutMutation } from "../services/appApi";
import { useSelector } from "react-redux";

export const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: ".9rem",
    padding: ".5rem .9rem",
  },
}));

const Navbar = () => {
  const [logoutFunction] = useLogoutMutation();
  const user = useSelector((state) => state.user);

  return (
    <div className="navbar-outer">
      <div className="sidebar">
        <div className="nav-item" id="nav-item">
          <LinkContainer style={{ textDecoration: "none" }} to="/">
            <Nav.Link>
              <BootstrapTooltip title="Home" placement="right" arrow>
                <Button className="nav-button" variant="text" startIcon={<HomeRoundedIcon />}>
                  Home
                </Button>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>

        {user && (
          <div className="nav-item" id="nav-item">
            <LinkContainer style={{ textDecoration: "none" }} to="/create/file">
              <Nav.Link>
                <BootstrapTooltip title="Create File" placement="right" arrow>
                  <Button className="nav-button" variant="text" startIcon={<AddRoundedIcon />}>
                    Create File
                  </Button>
                </BootstrapTooltip>
              </Nav.Link>
            </LinkContainer>
          </div>
        )}

        {user && (
          <div className="nav-item" id="nav-item">
            <LinkContainer style={{ textDecoration: "none" }} to="/discuss">
              <Nav.Link>
                <BootstrapTooltip title="Discuss Panel" placement="right" arrow>
                  <Button className="nav-button" variant="text" startIcon={<NearMeRoundedIcon />}>
                    Discuss
                  </Button>
                </BootstrapTooltip>
              </Nav.Link>
            </LinkContainer>
          </div>
        )}

        {!user && (
          <div className="nav-item" id="nav-item">
            <LinkContainer style={{ textDecoration: "none" }} to="/login">
              <Nav.Link>
                <BootstrapTooltip title="Login" placement="right" arrow>
                  <Button className="nav-button" variant="text" startIcon={<LoginRoundedIcon />}>
                    Login
                  </Button>
                </BootstrapTooltip>
              </Nav.Link>
            </LinkContainer>
          </div>
        )}

        {!user && (
          <div className="nav-item" id="nav-item">
            <LinkContainer style={{ textDecoration: "none" }} to="/signup">
              <Nav.Link>
                <BootstrapTooltip title="Signup" placement="right" arrow>
                  <Button
                    className="nav-button"
                    variant="text"
                    startIcon={<PersonAddRoundedIcon />}
                  >
                    Signup
                  </Button>
                </BootstrapTooltip>
              </Nav.Link>
            </LinkContainer>
          </div>
        )}

        {user && (
          <div className="nav-item" id="nav-item">
            <BootstrapTooltip title="Logout" placement="right" arrow>
              <Button onClick={logoutFunction} className="nav-button" variant="text" startIcon={<ExitToAppRoundedIcon />}>
                Logout
              </Button>
            </BootstrapTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;