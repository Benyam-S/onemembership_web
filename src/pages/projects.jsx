import React, { Component, Fragment } from "react";
import TopNavigationBar from "../components/navigation/topNavigation";
import SearchIcon from "@mui/icons-material/Search";
import { AddBusiness, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import ReactLoading from "react-loading";
import Button from "../components/form/button";
import axios from "axios";
import { BASE_URL } from "../entity/constants";
import "../style/projects.css";
import emptyResult from "../assets/images/no_result.webp";

class Projects extends Component {
  constructor(props) {
    super(props);

    const searchTerm = new URLSearchParams(this.props.location.search).get(
      "key"
    );

    const currentPage = new URLSearchParams(this.props.location.search).get(
      "page"
    );

    this.state = {
      searchTerm: searchTerm || "",
      cachedSearchTerm: searchTerm || "",
      searchResults: [],
      searchResultsTemp: [],
      searching: false,
      searchingTemp: false,
      showTempResults: false,
      currentPage: currentPage || 0,
      pageCount: 0,
    };
  }

  componentDidMount = () => {
    // Getting the search result with respect the search term
    this.handleSearch(this.state.searchTerm);
  };

  componentWillUnmount = () => {
    document.removeEventListener("click", this.globalClickListener);
  };

  globalClickListener = (event) => {
    // ignore click event happened inside the dropdown menu
    if (this.search_bar_body && this.search_bar_body.contains(event.target))
      return;

    // else hide dropdown menu
    this.setState({ showTempResults: false }, () => {
      document.removeEventListener("click", this.globalClickListener);
    });
  };

  handleOnGiveFocus = () => {
    if (!this.state.showTempResults) {
      this.setState({ showTempResults: true });

      // adding event listener
      document.addEventListener("click", this.globalClickListener);
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

  handleSetSearchValue = (event) => {
    const searchTerm = event.target.value;

    if (!searchTerm || searchTerm.length < 2) {
      this.setState({
        searchTerm,
        searchResultsTemp: [],
        searchingTemp: false,
      });

      return;
    }

    this.setState({ searchTerm, searchingTemp: true });

    // initiating focus while typing
    this.handleOnGiveFocus();

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
                searchingTemp: false,
              });
            } else {
              that.setState({
                searchResultsTemp: Result,
                searchingTemp: false,
              });
            }
          }
        })
        .catch(function (error) {
          that.setState({
            searchResultsTemp: [],
            searchingTemp: false,
          });
        });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  };

  handleSearch = (searchTerm) => {
    let currentPage = this.state.currentPage;
    if (!searchTerm || searchTerm.length < 2) {
      return;
    }

    if (this.state.cachedSearchTerm !== searchTerm) {
      currentPage = 0;
    }

    this.setState({ searching: true, showTempResults: false });

    // always hide the temporary search result on search
    document.removeEventListener("click", this.globalClickListener);

    const that = this;

    axios
      .get(BASE_URL + `project/search?key=${searchTerm}&page=${currentPage}`)
      .then(function (response) {
        if (response.data) {
          const { Result, CurrentPage, PageCount } = response.data;
          that.setState({
            searchResults: Result,
            cachedSearchTerm: that.state.searchTerm,
            currentPage: CurrentPage,
            pageCount: PageCount,
            searching: false,
          });
        }
      })
      .catch(function (error) {
        that.setState({
          searchResults: [],
          cachedSearchTerm: that.state.searchTerm,
          currentPage: 0,
          pageCount: 0,
          searching: false,
        });
      });
  };

  render() {
    const {
      searchTerm,
      cachedSearchTerm,
      searching,
      searchingTemp,
      searchResults,
      searchResultsTemp,
      showTempResults,
      currentPage,
      pageCount,
    } = this.state;

    let start =
      currentPage < 7
        ? 1
        : pageCount >= currentPage + 1
        ? currentPage - 5
        : currentPage - 6;

    let end =
      currentPage < 7
        ? pageCount > 7
          ? 7
          : pageCount
        : pageCount >= currentPage + 1
        ? currentPage + 1
        : pageCount;

    var foo = [];
    for (var i = start; i <= end; i++) {
      foo.push(i);
    }

    return (
      <Fragment>
        <TopNavigationBar
          showPages={false}
          showLogin={false}
          showProfile={true}
          showSearchBar={true}
          user={{ profile_pic: "", display_name: "Benyam Simayehu" }}
        />
        <div>
          <div className="pb-4 mb-5"></div>
          <div className="projects-container">
            <div className="d-flex align-items-center">
              <div style={{ flexGrow: "2" }}>
                <div
                  className="position-relative"
                  onFocus={this.handleOnGiveFocus}
                  ref={(ref) => (this.search_bar_body = ref)}
                >
                  <div className="search-bar-container">
                    <button
                      disabled={searching || searchingTemp ? true : false}
                      onClick={() => this.handleSearch(searchTerm)}
                    >
                      {searchingTemp ? (
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
                      showTempResults
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

              <div className="me-3"></div>
              <div className="removable me-3">
                <Button
                  onClick={() => this.handleSearch(searchTerm)}
                  className={
                    searching
                      ? "form-button light-button-disabled"
                      : "form-button light-button-active"
                  }
                >
                  Search
                </Button>
              </div>

              <div>
                <Tooltip title="Add Project">
                  <IconButton>
                    <AddBusiness />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div className="projects-result">
              {searching ? (
                <div>
                  <ReactLoading
                    type="bars"
                    color="rgb(177, 172, 163)"
                    className="project-searching"
                  />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(
                  ({
                    id,
                    project_image,
                    name,
                    description,
                    project_link,
                    subscribers,
                  }) => (
                    <a
                      className="projects-result-item"
                      key={id}
                      href="/projects/test_project"
                    >
                      <div className="d-flex">
                        <div>
                          <Avatar
                            sx={{ width: "3rem", height: "3rem" }}
                            alt={name}
                            src={project_image}
                          />
                        </div>

                        <div className="result-item-container">
                          <div className="result-item-name">
                            <span>{name}</span>
                          </div>

                          <div className="result-item-link">
                            <span>{project_link}</span>
                          </div>

                          <div className="result-item-description">
                            <span>{description}</span>
                          </div>
                        </div>

                        {subscribers ? (
                          <div>
                            <div className="result-item-subscribers">
                              <span>{subscribers}</span>
                            </div>
                            <div>
                              <span>Subscribers</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </a>
                  )
                )
              ) : (
                <div className="search-result-empty">
                  <img src={emptyResult}></img>
                  {cachedSearchTerm ? (
                    <div>
                      <span>No match for </span>{" "}
                      <span style={{ fontWeight: "700" }}>
                        "{cachedSearchTerm}"
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {pageCount > 1 ? (
              <div className="pagination-container">
                <div>
                  {currentPage > 1 ? (
                    <a
                      href={`/projects/search?key=${cachedSearchTerm}&page=${
                        currentPage - 1
                      }`}
                    >
                      <div>
                        <ChevronLeft />
                      </div>
                    </a>
                  ) : (
                    <div color="gray2" className="disabled-page">
                      <ChevronLeft />
                    </div>
                  )}

                  {foo.map((index) => {
                    if (index === currentPage) {
                      return (
                        <span
                          key={index}
                          color="gray2"
                          className="disabled-page"
                        >
                          {index}
                        </span>
                      );
                    }

                    return (
                      <a
                        key={index}
                        href={`/projects/search?key=${cachedSearchTerm}&page=${index}`}
                        className="active-page"
                      >
                        {index}
                      </a>
                    );
                  })}

                  {currentPage >= pageCount ? (
                    <div color="gray2" className="disabled-page">
                      <ChevronRight />
                    </div>
                  ) : (
                    <a
                      href={`/projects/search?key=${cachedSearchTerm}&page=${
                        currentPage + 1
                      }`}
                    >
                      <div>
                        <ChevronRight />
                      </div>
                    </a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Projects;
