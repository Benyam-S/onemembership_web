import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import Close from "@mui/icons-material/Close";
import Logout from "@mui/icons-material/Logout";
import RoomService from "@mui/icons-material/RoomService";
import filledLogo from "../../assets/images/circled_o_filled.png";
import Button from "../form/button";
import ReactLoading from "react-loading";
import { BASE_URL } from "../../entity/constants";
import axios from "axios";
import "../../style/navigation.css";

class TopNavigationBar extends Component {
  constructor(props) {
    super(props);

    const { showLogin, showPages, showSearchBar, showProfile } = props;

    this.state = {
      showLogin: showLogin,
      showPages: showPages,
      showSearchBar: showSearchBar,
      showProfile: showProfile,
      user: null,
      navOpen: false,
      anchorElUser: null,
      searchTerm: "",
      searching: false,
      searchResultsTemp: [],
      showTempResultsSmall: false,
      showTempResultsFull: false,
      currentPage: 0,
    };
  }

  componentDidMount = () => {
    const that = this;

    // showProfile = true means the user has logged in
    if (this.state.showProfile) {
      axios
        .get(BASE_URL + "service_provider/profile")
        .then(function (response) {
          if (response) {
            const user = response.data;
            that.setState({ user });

            that.props.setPageLoading(false);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.status == 403 || error.response.status == 401) {
              window.location.href = "/login"; // kicking the user out
            }
          }
        });
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("click", this.globalClickListenerFull);
    document.removeEventListener("click", this.globalClickListenerSmall);
  };

  globalClickListenerSmall = (event) => {
    // ignore click event happened inside the dropdown menu
    if (
      this.search_bar_body_sm &&
      this.search_bar_body_sm.contains(event.target)
    )
      return;

    // else hide dropdown menu
    this.setState({ showTempResultsSmall: false }, () => {
      document.removeEventListener("click", this.globalClickListenerSmall);
    });
  };

  globalClickListenerFull = (event) => {
    // ignore click event happened inside the dropdown menu
    if (
      this.search_bar_body_full &&
      this.search_bar_body_full.contains(event.target)
    )
      return;

    // else hide dropdown menu
    this.setState({ showTempResultsFull: false }, () => {
      document.removeEventListener("click", this.globalClickListenerFull);
    });
  };

  handleOnGiveFocusSmall = (event) => {
    if (!this.state.showTempResultsSmall) {
      this.setState({ showTempResultsSmall: true });

      // adding event listener
      document.addEventListener("click", this.globalClickListenerSmall);
      return;
    }
  };

  handleOnGiveFocusFull = (event) => {
    if (!this.state.showTempResultsFull) {
      this.setState({ showTempResultsFull: true });

      // adding event listener
      document.addEventListener("click", this.globalClickListenerFull);
      return;
    }
  };

  searchItem = (id, name, project_link, project_image) => {
    const { searchTerm } = this.state;
    let nameSpan = <span>{name}</span>;
    let linkSpan = <span>{project_link}</span>;
    let regex = new RegExp("^" + searchTerm, "i");

    const matchName = regex.exec(name);
    if (matchName && matchName !== -1) {
      nameSpan = (
        <span>
          <span style={{ backgroundColor: "yellow" }}>
            {name.slice(0, searchTerm.length)}
          </span>
          <span>{name.slice(searchTerm.length)}</span>
        </span>
      );
    }

    const matchLink = regex.exec(project_link);
    if (matchLink && matchLink !== -1) {
      linkSpan = (
        <span>
          <span style={{ backgroundColor: "yellow" }}>
            {project_link.slice(0, searchTerm.length)}
          </span>
          <span>{project_link.slice(searchTerm.length)}</span>
        </span>
      );
    }

    return (
      <div key={id} className="search-item-container">
        <div
          className="search-item-image"
          src={project_image}
          style={{ backgroundImage: `url(${project_image})` }}
        ></div>
        <div className="ms-3">
          <div className="search-item-name">{nameSpan}</div>
          <div className="search-item-link">{linkSpan}</div>
        </div>
      </div>
    );
  };

  handleNavMenu = () => {
    this.setState({ navOpen: !this.state.navOpen });
  };

  handleOpenUserMenu = (event) => {
    this.setState({ anchorElUser: event.currentTarget });
  };

  handleCloseUserMenu = () => {
    this.setState({ anchorElUser: null });
  };

  handleSetSearchValue = (event) => {
    const searchTerm = event.target.value;
    if (!searchTerm || searchTerm.length < 2) {
      this.setState({
        searchTerm,
        searchResultsTemp: [],
        searching: false,
      });
      return;
    }

    this.setState({ searchTerm, searching: true });

    const that = this;
    const delayDebounceFn = setTimeout(() => {
      axios
        .get(
          BASE_URL +
            `project/search?key=${searchTerm}&page=${this.state.currentPage}`
        )
        .then(function (response) {
          if (response.data) {
            const { Result } = response.data;
            if (!that.state.searchTerm) {
              // Checking for request that took long and resting them
              that.setState({
                searchResultsTemp: [],
                searching: false,
              });
            } else {
              that.setState({
                searchResultsTemp: Result,
                searching: false,
              });
            }
          }
        })
        .catch(function (error) {
          that.setState({
            searchResultsTemp: [],
            searching: false,
          });
        });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  };

  handleSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      return;
    }
    window.open("/projects/search?key=" + searchTerm, "_self");
  };

  handleLogout = () => {
    this.props.setPageLoading(true);
    this.setState({ anchorElUser: null, navOpen: false }); // Closing the navigation bars

    axios
      .get(BASE_URL + "service_provider/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch(() => {
        this.props.setPageLoading(false);
      });
  };

  render() {
    const {
      showLogin,
      showPages,
      showSearchBar,
      showProfile,
      navOpen,
      anchorElUser,
      user,
      searchTerm,
      searching,
      searchResultsTemp,
      showTempResultsSmall,
      showTempResultsFull,
      pageLoading,
    } = this.state;

    const pages = [
      { name: "How to start", link: "/how_to_start" },
      { name: "Features", link: "/features" },
      { name: "Pricing", link: "/pricing" },
      { name: "FAQ", link: "/faq" },
    ];

    let settings = [];
    if (showPages) {
      settings.push(
        ...[
          { name: "How to start", link: "/how_to_start" },
          { name: "Features", link: "/features" },
          { name: "Pricing", link: "/pricing" },
          { name: "FAQ", link: "/faq" },
        ]
      );
    }

    if (showLogin) {
      settings.push(
        ...[
          { name: "Log In", link: "/login" },
          { name: "Sign Up", link: "/signup" },
        ]
      );
    }

    if (showProfile) {
      settings = [
        { name: "My Profile", link: "/profile", icon: <AccountCircle /> },
        { name: "Projects", link: "/projects", icon: <BusinessCenter /> },
        {
          name: "Subscriptions",
          link: "/subscriptions",
          icon: <RoomService />,
        },
        { name: "Log Out", icon: <Logout /> },
      ];
    }

    return (
      <AppBar
        position={"fixed"}
        sx={{
          background: "white",
          boxShadow: "none",
          borderBottom: "1px solid rgb(229, 227, 221)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className={showPages ? "" : "app-bar-log-container"}>
              <img
                alt="Onemembership Logo"
                src={filledLogo}
                style={{
                  width: "2rem",
                  height: "2rem",
                  margin: "1rem 1rem 1rem 0rem",
                }}
              />
            </div>

            {showPages ? (
              <div className="app-bar-link-container removable">
                {pages.map(({ name, link }) => (
                  <a key={name} href={link} className="mx-3 app-bar-link">
                    {name}
                  </a>
                ))}
              </div>
            ) : null}

            {showSearchBar ? (
              <div
                className="removable"
                onFocus={this.handleOnGiveFocusSmall}
                ref={(ref) => (this.search_bar_body_sm = ref)}
              >
                <div className="search-bar-container">
                  <button
                    onClick={() => this.handleSearch(searchTerm)}
                    disabled={searching ? true : false}
                  >
                    {searching ? (
                      <ReactLoading
                        type="spin"
                        color="rgb(177, 172, 163)"
                        height="1.5rem"
                        width="1.5rem"
                      />
                    ) : (
                      <SearchIcon sx={{ color: "rgb(112, 108, 100)" }} />
                    )}
                  </button>
                  <input
                    aria-label="Search"
                    autoComplete="off"
                    placeholder="Search"
                    type="search"
                    style={{ width: "13rem" }}
                    value={searchTerm}
                    onChange={this.handleSetSearchValue}
                    onKeyPress={(e) =>
                      e.key === "Enter" && this.handleSearch(searchTerm)
                    }
                  ></input>
                </div>

                <div
                  style={
                    showTempResultsSmall
                      ? { display: "block", width: "17rem" }
                      : { display: "none", width: "17rem" }
                  }
                  className="search-result"
                >
                  {(searchResultsTemp.length > 5
                    ? searchResultsTemp.slice(0, 5) // showing only the first 5 items
                    : searchResultsTemp
                  ).map(({ id, name, project_link, project_image }) =>
                    this.searchItem(id, name, project_link, project_image)
                  )}

                  {searchResultsTemp.length > 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "0.8rem 1rem",
                      }}
                    >
                      <a
                        href={"/projects/search?key=" + searchTerm}
                        className="app-bar-link"
                      >
                        See all results
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {showLogin ? (
              <div className="login-signup-container removable">
                <a href="/login" className="ms-3 me-2 app-bar-link">
                  Log In
                </a>

                <Button className="form-button form-button-sm create-button">
                  <a href={"/signup"}>Create account</a>
                </Button>
              </div>
            ) : null}

            {showProfile ? (
              <div className="ms-4 app-bar-profile removable">
                <IconButton onClick={this.handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "rgb(51 141 255)" }}
                    alt={user ? user.display_name : ""}
                    src={user ? user.profile_pic : ""}
                  />
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={this.handleCloseUserMenu}
                >
                  {settings.map(({ name, link }) => {
                    if (name === "Log Out") {
                      return (
                        <button
                          key={name}
                          className="profile-link"
                          onClick={this.handleLogout}
                        >
                          <MenuItem key={name}>
                            <Typography textAlign="center">{name}</Typography>
                          </MenuItem>
                        </button>
                      );
                    } else {
                      return (
                        <a key={name} className="profile-link" href={link}>
                          <MenuItem
                            key={name}
                            onClick={this.handleCloseUserMenu}
                          >
                            <Typography textAlign="center">{name}</Typography>
                          </MenuItem>
                        </a>
                      );
                    }
                  })}
                </Menu>
              </div>
            ) : null}

            <div className="app-bar-toggle-button">
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.handleNavMenu}
                color="inherit"
              >
                {navOpen ? (
                  <Close sx={{ color: "black" }} />
                ) : (
                  <MenuIcon sx={{ color: "black" }} />
                )}
              </IconButton>

              <div
                className={navOpen ? "d-block" : "d-none"}
                id="full-screen-menu"
              >
                <div className="mx-3">
                  <div className="mt-3 mb-2">
                    <div
                      className="w-100 position-relative"
                      onFocus={this.handleOnGiveFocusFull}
                      ref={(ref) => (this.search_bar_body_full = ref)}
                    >
                      <div className="search-bar-container">
                        <button
                          disabled={searching ? true : false}
                          onClick={() => this.handleSearch(searchTerm)}
                        >
                          {searching ? (
                            <ReactLoading
                              type="spin"
                              color="rgb(177, 172, 163)"
                              height="1.5rem"
                              width="1.5rem"
                            />
                          ) : (
                            <SearchIcon sx={{ color: "rgb(112, 108, 100)" }} />
                          )}
                        </button>
                        <input
                          aria-label="Search"
                          autoComplete="off"
                          placeholder="Search"
                          type="search"
                          value={searchTerm}
                          onChange={this.handleSetSearchValue}
                          onKeyPress={(e) =>
                            e.key === "Enter" && this.handleSearch(searchTerm)
                          }
                        ></input>
                      </div>

                      <div
                        style={
                          showTempResultsFull
                            ? { display: "block" }
                            : { display: "none" }
                        }
                        className="search-result"
                      >
                        {(searchResultsTemp.length > 5
                          ? searchResultsTemp.slice(0, 5) // showing only the first 5 items
                          : searchResultsTemp
                        ).map(({ id, name, project_link, project_image }) =>
                          this.searchItem(id, name, project_link, project_image)
                        )}

                        {searchResultsTemp.length > 0 ? (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "0.8rem 1rem",
                            }}
                          >
                            <a
                              href={"/projects/search?key=" + searchTerm}
                              className="app-bar-link"
                            >
                              See all results
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {settings.map(({ name, link, icon }) => {
                    if (name === "Log Out") {
                      return (
                        <div key={name}>
                          <button
                            key={name}
                            onClick={this.handleLogout}
                            role="menuitem"
                            className="menu-link"
                          >
                            <ListItem color="secondary">
                              {icon ? (
                                <ListItemAvatar>{icon}</ListItemAvatar>
                              ) : null}
                              <ListItemText
                                sx={{
                                  ".MuiTypography-root": {
                                    fontWeight: "500",
                                    fontFamily:
                                      "font-family: aktiv-grotesk, sans-serif",
                                  },
                                }}
                                primary={name}
                              />
                            </ListItem>
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div key={name}>
                          <a role="menuitem" href={link} className="menu-link">
                            <ListItem color="secondary">
                              {icon ? (
                                <ListItemAvatar>{icon}</ListItemAvatar>
                              ) : null}
                              <ListItemText
                                sx={{
                                  ".MuiTypography-root": {
                                    fontWeight: "500",
                                    fontFamily:
                                      "font-family: aktiv-grotesk, sans-serif",
                                  },
                                }}
                                primary={name}
                              />
                            </ListItem>
                          </a>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
}

export default TopNavigationBar;
