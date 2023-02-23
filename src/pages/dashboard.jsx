import React, { Component, Fragment } from "react";
import TopNavigationBar from "../components/navigation/topNavigation";
import PageContent from "../components/page/pageContent";

class Home extends Component {
  state = {
    isPageLoading: true,
  };

  setPageLoading = (value) => {
    this.setState({ isPageLoading: value });
  };

  render() {
    return (
      <Fragment>
        <TopNavigationBar
          showPages={false}
          showLogin={false}
          showProfile={true}
          showSearchBar={true}
          setPageLoading={this.setPageLoading}
        />
        <div className="pb-4 mb-5"></div>

        <PageContent isPageLoading={this.state.isPageLoading}>
          <div
            style={{
              position: "absolute",
              width: "100%",
              display: "block",
              top: "45%",
              textAlign: "center",
            }}
          >
            Hello World, Dashboard
          </div>
        </PageContent>
      </Fragment>
    );
  }
}

export default Home;
