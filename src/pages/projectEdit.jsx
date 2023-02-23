import React, { Component, Fragment } from "react";
import TopNavigationBar from "../components/navigation/topNavigation";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper, styled } from "@mui/material";
import ProjectBasics from "./projectBasics";
import ProjectPlans from "./projectPlans";
import ProjectSettings from "./projectSettings";
import "../style/projectEdit.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

class ProjectEdit extends Component {
  state = { value: 0 };

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <Fragment>
        <TopNavigationBar
          showPages={false}
          showLogin={false}
          showProfile={true}
          showSearchBar={true}
        />

        <div className="mt-5 pt-4"></div>
        <div className="project-edit-outer">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                variant="scrollable"
                scrollButtons="auto"
                onChange={this.handleTabChange}
                sx={{
                  ".Mui-selected": {
                    color: "rgb(36, 30, 18) !important",
                  },
                  ".MuiTab-root": {
                    textTransform: "none",
                    fontFamily: "aktiv-grotesk, sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    marginRight: "10px",
                  },
                }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "rgb(36, 30, 18)",
                  },
                }}
              >
                <Tab label="Basics" {...this.a11yProps(0)} />
                <Tab label="Plans" {...this.a11yProps(1)} />
                <Tab label="Settings" {...this.a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ProjectBasics />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ProjectPlans />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ProjectSettings />
            </TabPanel>
          </Box>
        </div>
      </Fragment>
    );
  }
}

export default ProjectEdit;
