import { Add, ArrowForward, CameraOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import React, { Component, Fragment } from "react";
import TopNavigationBar from "../components/navigation/topNavigation";
import Button from "../components/form/button";
import "../style/projectAdd.css";

class ProjectPlans extends Component {
  state = {
    name: "",
    nameError: "",
    projectLink: "",
    projectLinkError: "",
    description: "",
    descriptionError: "",
    addProjectButtonStatus: "active",
  };

  render() {
    const {
      name,
      projectLink,
      description,
      nameError,
      projectLinkError,
      descriptionError,
      addProjectButtonStatus,
    } = this.state;

    return (
      <Fragment>
        <TopNavigationBar
          showPages={false}
          showLogin={false}
          showProfile={true}
          showSearchBar={true}
        />

        <div className="pb-4 mb-5"></div>

        <div className="p-3">
          <div className="add-project-title-container">
            <h1 color="dark">Subscription Plans</h1>
            <p color="gray2">Choose what to offer your subscribers</p>
          </div>

          <div className="plans-segment-outer">
            <div>
              <div className="plan-card">
                <div>
                  <div>
                    <div className="mb-3 d-flex flex-row justify-content-between">
                      <div>
                        <div className="plan-card-label-small">
                          Published Mar 19, 2022
                        </div>
                        <div className="plan-card-label-small">0 patrons</div>
                      </div>
                      <div>
                        <button className="plan-card-edit">Edit Plan</button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="plan-card-title">Official Patron</h6>
                      <span className="plan-card-label-small">
                        $3 per month
                      </span>
                    </div>

                    <div>
                      <h1 className="plan-card-benefit">
                        Behind-the-scenes content
                      </h1>
                      <h1 className="plan-card-benefit">Livestreams</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="plan-card">
                <div>
                  <div>
                    <div className="mb-3 d-flex flex-row justify-content-between">
                      <div>
                        <div className="plan-card-label-small">
                          Published Mar 19, 2022
                        </div>
                        <div className="plan-card-label-small">0 patrons</div>
                      </div>
                      <div>
                        <button className="plan-card-edit">Edit Plan</button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="plan-card-title">Official Patron</h6>
                      <span className="plan-card-label-small">
                        $3 per month
                      </span>
                    </div>

                    <div>
                      <h1 className="plan-card-benefit">
                        Behind-the-scenes content
                      </h1>
                      <h1 className="plan-card-benefit">Livestreams</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="plan-card">
                <div>
                  <div>
                    <div className="mb-3 d-flex flex-row justify-content-between">
                      <div>
                        <div className="plan-card-label-small">
                          Published Mar 19, 2022
                        </div>
                        <div className="plan-card-label-small">0 patrons</div>
                      </div>
                      <div>
                        <button className="plan-card-edit">Edit Plan</button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="plan-card-title">Official Patron</h6>
                      <span className="plan-card-label-small">
                        $3 per month
                      </span>
                    </div>

                    <div>
                      <h1 className="plan-card-benefit">
                        Behind-the-scenes content
                      </h1>
                      <h1 className="plan-card-benefit">Livestreams</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="plan-add-card">
                <div>
                  <button className="d-flex align-items-center justify-content-center">
                    <div className="me-1">
                      <Add fontSize="small" />
                    </div>
                    <span color="navy">Add tier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ProjectPlans;
