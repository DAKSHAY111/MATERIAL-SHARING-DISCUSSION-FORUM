import React from "react";
import { IconButton } from "@mui/material";
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

import "../Style/Navbar.css";

const BootstrapTooltip = styled(({ className, ...props }) => (
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
  return (
    <div className="navbar-outer">
      <div className="sidebar">
        <div className="nav-item" id="nav-item">
          <LinkContainer to="/">
            <Nav.Link>
              <BootstrapTooltip title="Home" placement="right" arrow>
                <IconButton>
                  <HomeRoundedIcon className="nav-button" color="primary" />
                </IconButton>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>

        <div className="nav-item" id="nav-item">
          <LinkContainer to="/create/file">
            <Nav.Link>
              <BootstrapTooltip title="Create File" placement="right" arrow>
                <IconButton>
                  <AddRoundedIcon className="nav-button" color="primary" />
                </IconButton>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>

        <div className="nav-item" id="nav-item">
          <LinkContainer to="/discuss">
            <Nav.Link>
              <BootstrapTooltip title="Discuss Panel" placement="right" arrow>
                <IconButton>
                  <NearMeRoundedIcon className="nav-button" color="primary" />
                </IconButton>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>

        <div className="nav-item" id="nav-item">
          <LinkContainer to="/login">
            <Nav.Link>
              <BootstrapTooltip title="Login" placement="right" arrow>
                <IconButton>
                  <LoginRoundedIcon className="nav-button" color="primary" />
                </IconButton>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>

        <div className="nav-item" id="nav-item">
          <LinkContainer to="/signup">
            <Nav.Link>
              <BootstrapTooltip title="Signup" placement="right" arrow>
                <IconButton>
                  <PersonAddRoundedIcon
                    className="nav-button"
                    color="primary"
                  />
                </IconButton>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>

        <div className="nav-item" id="nav-item">
          <LinkContainer to="/logout">
            <Nav.Link>
              <BootstrapTooltip title="Logout" placement="right" arrow>
                <IconButton>
                  <ExitToAppRoundedIcon
                    className="nav-button"
                    color="primary"
                  />
                </IconButton>
              </BootstrapTooltip>
            </Nav.Link>
          </LinkContainer>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
