import React, { Component, Fragment } from "react";
import TopNavigationBar from "../components/navigation/topNavigation";
import { Step, StepLabel, Stepper } from "@mui/material";
import ProjectBasics from "./projectBasics";
import ProjectPlan from "./projectPlan";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../style/projectAdd.css";
import PageContent from "../components/page/pageContent";

class ProjectAdd extends Component {
  state = {
    currentStep: 0,
    project: null,
    isPageLoading: true,
  };

  setPageLoading = (value) => {
    this.setState({ isPageLoading: value });
  };

  setProject = (project) => {
    this.setState({ project });
  };

  renderCurrentStep = (currentStep) => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectBasics
            setProject={this.setProject}
            onNext={() => this.nextStep(0)}
          />
        );

      case 1:
        return (
          <ProjectPlan
            project={this.state.project}
            onNext={() => this.nextStep(1)}
          />
        );

      case 2:
        return <ProjectBasics />;
    }
  };

  nextStep = (currentStep) => {
    this.setState({ currentStep: currentStep + 1 });
  };

  render() {
    const { currentStep, isPageLoading } = this.state;

    return (
      <Fragment>
        <TopNavigationBar
          showPages={false}
          showLogin={false}
          showProfile={true}
          showSearchBar={true}
          setPageLoading={this.setPageLoading}
        />

        <PageContent isPageLoading={isPageLoading}>
          <div className="pt-5 my-5">
            <div className="mt-2"></div>

            <Stepper activeStep={currentStep} alternativeLabel>
              <Step key={1}>
                <StepLabel>Basics</StepLabel>
              </Step>

              <Step key={2}>
                <StepLabel>Plans</StepLabel>
              </Step>

              <Step key={3}>
                <StepLabel>Finish</StepLabel>
              </Step>
            </Stepper>
          </div>

          <div className="add-project-outer m-auto p-3">
            <TransitionGroup component={"div"}>
              <CSSTransition
                classNames={"slider"}
                timeout={{ enter: 500, exit: 300 }}
              >
                <div className="slide">
                  {this.renderCurrentStep(currentStep)}
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </PageContent>
      </Fragment>
    );
  }
}

export default ProjectAdd;
