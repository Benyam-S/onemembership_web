import React, { Component, Fragment } from "react";
import {
  ArrowForward,
  CameraOutlined,
  Close,
  KeyboardArrowDown,
  NotInterestedOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import CurrencyTextField from "../components/form/inputCurrency";
import Button from "../components/form/button";
import { BASE_URL } from "../entity/constants";
import { sentenceCase } from "../tools/strings";
import axios from "axios";
import AutoNumeric from "autonumeric";
import "../style/project.css";

class ProjectPlan extends Component {
  state = {
    name: "",
    nameError: "",
    price: "0",
    priceError: "",
    isRecurring: true,
    duration: "",
    durationError: "",
    addPlanButtonStatus: "disabled",
    planImage: null,
    planImageURL: "https://c8.patreon.com/2/200/c7907809",
    planImageError: "",
    addPlanResponse: "",
    customBenefitNew: true,
    benefitID: "",
    benefitName: "",
    benefitNameError: "",
    benefitDescription: "",
    addBenefitButtonStatus: "disabled",
    benefits: [],
    selectedBenefits: [],
    benefitDialogOpen: false,
    customDialogOpen: false,
    defaultBenefit: {
      id: "General-s6s19W91",
      name: "General Support",
      description:
        "Add this benefit to indicate that some or all of this plan is purely monetary support " +
        "(i.e. patrons don’t receive anything in return) to ensure patrons pay the correct amount of " +
        "sales tax for their pledge where applicable.",
    },
  };

  // Initiating the session
  componentDidMount = () => {
    let { benefits, selectedBenefits, defaultBenefit } = this.state;

    // Adding default benefit
    selectedBenefits.push(defaultBenefit);
    benefits.push(defaultBenefit);

    axios
      .get(BASE_URL + "project/subscription_plan/benefits")
      .then(function (response) {
        if (response) {
          const data = response.data;
          data.forEach((benefit) => {
            if (benefit.id !== defaultBenefit.id) {
              benefits.push({ ...benefit });
            }
          });
        }
      });

    this.setState({ selectedBenefits, benefits });
  };

  validateFormStatus = () => {
    let addPlanButtonStatus = "active";

    // In order to activate or deactivate the add button
    Object.entries(this.validateInput(this.state)).forEach(([key, value]) => {
      if (!value) {
        addPlanButtonStatus = "disabled";
        return;
      }
    });

    this.setState({ addPlanButtonStatus });
  };

  validateInput = (inputs) => {
    const { name, duration, price, planImage } = inputs;
    const { isRecurring, selectedBenefits } = this.state;

    const isValidName = name.length >= 1 && name.length <= 255;
    const isValidDuration = isRecurring
      ? /^[0-9]+$/.test(duration)
        ? duration >= 1 && duration <= 1000000
        : false
      : true;
    const isValidPrice = !isNaN(price.replaceAll(",", ""))
      ? price.replaceAll(",", "") >= 0
      : false;
    const isValidPlanImage = planImage ? planImage.size <= 20000000 : false;

    // Checking the benefits
    const isValidBenefits = selectedBenefits.length > 0;

    return {
      name: isValidName,
      duration: isValidDuration,
      price: isValidPrice,
      planImage: isValidPlanImage,
      benefits: isValidBenefits,
    };
  };

  // Validating the input plan form value
  handleValidateInput = (props) => (event) => {
    const newState = { ...this.state };
    const value = event.target.value;
    let isFormValid = true;

    Object.entries(this.validateInput(newState)).forEach(([key, value]) => {
      if (!value) {
        isFormValid = false;
        return;
      }
    });

    // Resetting old sign up response error
    newState["addPlanResponse"] = "";

    if (isFormValid) {
      newState["addPlanButtonStatus"] = "active";
    } else {
      newState["addPlanButtonStatus"] = "disabled";
    }

    if (value == "") {
      // Resetting error value if empty
      newState[[props + "Error"]] = value;
      this.setState(newState);

      return;
    }

    if (props === "name") {
      const isValidName = this.validateInput(newState)["name"];
      if (!isValidName) {
        newState["nameError"] = "Please enter valid plan name.";
      } else {
        newState["nameError"] = "";
      }
    } else if (props === "duration") {
      const isValidDuration = this.validateInput(newState)["duration"];
      if (!isValidDuration) {
        newState["durationError"] = "Please enter valid plan duration.";
      } else {
        newState["durationError"] = "";
      }
    } else if (props === "price") {
      const isValidPrice = this.validateInput(newState)["price"];
      if (!isValidPrice) {
        newState["priceError"] = "Please enter valid plan price.";
      } else {
        newState["priceError"] = "";
      }
    } else if (props === "planImage") {
      const isValidProjectImage = this.validateInput(newState)["planImage"];
      if (!isValidProjectImage) {
        newState["planImageError"] = "Image exceeds the file size limit, 20MB.";
      } else {
        newState["planImageError"] = "";
      }
    }

    this.setState(newState);
  };

  handleValidateBenefitInput = (benefitID) => (event) => {
    const value = event.target.value;
    const isValidBenefitName = /^.{1,255}$/.test(value);
    let isBenefitNameDuplicate = false;

    this.state.selectedBenefits.forEach((item, index) => {
      const { id, name } = item;

      // For checking any duplicates in name
      if (benefitID !== id && name === value) {
        isBenefitNameDuplicate = true;
        return;
      }
    });

    this.setState({
      addBenefitButtonStatus:
        isValidBenefitName && !isBenefitNameDuplicate ? "active" : "disabled",
      benefitNameError:
        isValidBenefitName || value === ""
          ? isBenefitNameDuplicate
            ? "Benefit name already selected."
            : ""
          : "Please enter valid benefit name.",
    });
  };

  // Controlling input value
  handleInputChange = (props) => (event) => {
    this.setState({ [props]: event.target.value });
  };

  handleSwitchChange = (event) => {
    const { isRecurring } = this.state;
    this.setState({ isRecurring: !isRecurring });

    setTimeout(this.validateFormStatus, 500);
  };

  onImageChange = (props) => (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      const imageURL = URL.createObjectURL(image);

      if (props === "planImage") {
        this.setState({
          planImage: image,
          planImageURL: imageURL,
        });
      }

      // In order to activate the add button
      setTimeout(() => this.handleValidateInput(props)(event), 500);
    }
  };

  handleBenefitDialogOpen = () => {
    this.setState({ benefitDialogOpen: true });
  };

  handleBenefitDialogClose = () => {
    this.setState({ benefitDialogOpen: false });
  };

  handleCustomDialogOpen = (benefitID, benefitName, benefitDescription) => {
    this.setState({
      benefitDialogOpen: false,
      customDialogOpen: true,
      customBenefitNew: benefitID ? `${benefitID}`.startsWith("Custom-") : true,
      benefitID: benefitID,
      benefitName: benefitName,
      benefitDescription: benefitDescription,
      benefitNameError: "",
    });

    // In order to activate the add button
    if (benefitName) {
      setTimeout(
        () =>
          this.handleValidateBenefitInput(benefitID)({
            target: { value: benefitName },
          }),
        500
      );
    }
  };

  handleCustomDialogClose = () => {
    this.setState({
      customDialogOpen: false,
      benefitID: "",
      benefitName: "",
      benefitDescription: "'",
      addBenefitButtonStatus: false,
    });
  };

  handleAddToSelected =
    (benefitID, benefitName, benefitDescription) => (event) => {
      let selectedBenefits = [...this.state.selectedBenefits];

      let isAdded = false;
      selectedBenefits.forEach((item, index) => {
        const { id, name } = item;

        // For updating already add benefits
        if (id === benefitID) {
          isAdded = true;

          // If the benefit exists then update with the current value
          selectedBenefits[index] = {
            id: benefitID,
            name: benefitName,
            description: benefitDescription,
          };
          return;
        }
      });

      if (!isAdded) {
        if (!benefitID) {
          benefitID = "Custom-" + benefitName;
        }

        selectedBenefits.push({
          id: benefitID,
          name: benefitName,
          description: benefitDescription,
        });
      }

      this.setState({
        selectedBenefits,
        customDialogOpen: false,
        benefitID: "",
        benefitName: "",
        benefitDescription: "'",
        addBenefitButtonStatus: false,
      });

      setTimeout(this.validateFormStatus, 500);
    };

  handleRemoveToSelected = (benefitID) => () => {
    let selectedBenefits = [...this.state.selectedBenefits];
    selectedBenefits = selectedBenefits.filter(({ id }) => id !== benefitID);

    this.setState({ selectedBenefits });

    setTimeout(this.validateFormStatus, 500);
  };

  // handles request for adding new plan
  handleAddPlan = (event) => {
    // Start loading
    this.setState({
      nameError: "",
      priceError: "",
      durationError: "",
      planImageError: "",
      addPlanButtonStatus: "loading",
    });

    const { name, price, isRecurring, duration, selectedBenefits, planImage } =
      this.state;
    const { onNext, project } = this.props;
    const benefitsJson = JSON.stringify(selectedBenefits);

    const formData = new FormData();
    formData.append("project_id", project.id);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("is_recurring", isRecurring);
    formData.append("duration", duration);
    formData.append("plan_image", planImage);
    formData.append("benefits", benefitsJson);

    // Binding this to that
    const that = this;

    axios
      .post(BASE_URL + "project/subscription_plan/add", formData, {
        "Content-Type": "multipart/form-data",
      })
      .then(function (response) {
        console.log(response.data);
        if (response) {
          const data = response.data;
          // that.setState({});

          // Going to the next step
          onNext();
        } else {
          that.setState({
            addPlanResponse: "Sorry! Unable to add new plan.",
            addPlanButtonStatus: "active",
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          that.setState({
            nameError: data["name"] ? sentenceCase(data["name"] + ".") : "",
            priceError: data["price"] ? sentenceCase(data["price"] + ".") : "",
            durationError: data["duration"]
              ? sentenceCase(data["duration"] + ".")
              : "",
            planImageError: data["plan_image"]
              ? sentenceCase(data["plan_image"] + ".")
              : "",
            addPlanResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Unable to add new plan."
                : data["error"]
                ? data["error"]
                : "",
            addPlanButtonStatus: "active",
          });
        } else {
          that.setState({
            addPlanResponse: "Sorry! Unable to add new plan.",
            addPlanButtonStatus: "active",
          });
        }
      });

    event.preventDefault();
  };

  render() {
    const {
      name,
      price,
      isRecurring,
      duration,
      nameError,
      priceError,
      durationError,
      addPlanButtonStatus,
      planImageURL,
      planImageError,
      addPlanResponse,
      addBenefitButtonStatus,
      customBenefitNew,
      benefitID,
      benefitName,
      benefitNameError,
      benefitDescription,
      selectedBenefits,
      benefits,
      benefitDialogOpen,
      customDialogOpen,
      defaultBenefit,
    } = this.state;

    return (
      <Fragment>
        <div className="project-title-container">
          <h1 color="dark">Subscription Plans</h1>
          <p color="gray2">Choose what to offer your subscribers</p>
        </div>

        <div className="project-basic-segment">
          <div className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Plan name
              </div>
              <span color="gray2">
                Required <span style={{ color: "red" }}>*</span>
              </span>
            </div>

            <div className="project-input">
              <TextField
                label="Name"
                type={"text"}
                name="name"
                value={name}
                helperText={nameError}
                fullWidth
                onChange={this.handleInputChange("name")}
                onBlur={this.handleValidateInput("name")}
                error={nameError !== "" ? true : false}
              />
            </div>
          </div>

          <div className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Plan price
              </div>

              <span color="gray2">
                Required <span style={{ color: "red" }}>*</span>
              </span>
            </div>

            <div className="project-input">
              <CurrencyTextField
                label="Price"
                name="price"
                variant="outlined"
                value={price}
                helperText={priceError}
                currencySymbol="ETB"
                outputFormat="string"
                fullWidth
                onChange={this.handleInputChange("price")}
                onBlur={this.handleValidateInput("price")}
                inputProps={{ style: { textAlign: "right" } }}
                error={priceError !== "" ? true : false}
              />
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }} className="d-flex flex-row">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Is the plan recurring?
              </div>

              <span color="gray2">
                Required <span style={{ color: "red" }}>*</span>
              </span>
            </div>

            <div className="project-input d-flex justify-content-end">
              <Switch
                checked={isRecurring}
                onChange={this.handleSwitchChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
          </div>

          {isRecurring ? (
            <div className="project-input-container">
              <div style={{ flexBasis: "50%" }} className="project-label">
                <div role="heading" aria-level="2">
                  Plan duration
                </div>
                <span
                  color="gray2"
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  Required <span style={{ color: "red" }}>*</span>
                </span>

                <span color="gray2" style={{ display: "block" }}>
                  Enter subscription plan duration in terms of number of days, 1
                  for one day plan, 7 for a week plan or any number of day as
                  you prefer
                </span>
              </div>

              <div style={{ flexBasis: "50%" }} className="project-input">
                <TextField
                  label="Duration"
                  type={"number"}
                  name="duration"
                  value={duration}
                  helperText={durationError}
                  fullWidth
                  onChange={this.handleInputChange("duration")}
                  onBlur={this.handleValidateInput("duration")}
                  error={durationError !== "" ? true : false}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="project-basic-segment">
          <div className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Plan cover image
              </div>
              <span color="gray2">
                Required <span style={{ color: "red" }}>*</span>
              </span>
            </div>

            <div className="w-100">
              <div
                display="block"
                style={{
                  backgroundImage: `url(${planImageURL})`,
                }}
                className="avatar-img-block img-block"
              >
                <div
                  id="avatar-overlay-block"
                  data-tag="overlay"
                  className="img-overlay-block"
                >
                  <label>
                    <div className="d-none">
                      <input
                        type="file"
                        name="planImage"
                        accept="image/*"
                        onChange={this.onImageChange("planImage")}
                        aria-describedby="img-input-description"
                      ></input>
                    </div>

                    <div className="img-overly-icon">
                      <CameraOutlined />
                      <div color="light">Edit </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="text-center">
                <span
                  style={{
                    color: "rgb(204, 50, 63)",
                    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                    fontSize: "0.775rem",
                  }}
                >
                  {planImageError}
                </span>
              </div>
            </div>
          </div>

          <div data-tag="cover-image" className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Benefits
              </div>
              <span
                color="gray2"
                style={{ display: "block", marginBottom: "10px" }}
              >
                Required <span style={{ color: "red" }}>*</span>
              </span>
              <span color="gray2" style={{ display: "block" }}>
                You should have at least one benefit in each plan.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexBasis: "65%",
              }}
            >
              <div style={{ margin: "0.5rem auto 1rem" }}>
                <Button
                  onClick={this.handleBenefitDialogOpen}
                  className={"form-button form-button-sm light-button-active"}
                >
                  <span>
                    <span>Add Benefits</span>
                    <KeyboardArrowDown />
                  </span>
                </Button>
              </div>

              <div>
                {selectedBenefits.length > 0 ? (
                  selectedBenefits.map((selectedBenefit) => {
                    const { id, name, description } = selectedBenefit;

                    return (
                      <div key={name} className="benefit-container">
                        <div color="dark">{name}</div>

                        <div className="d-flex">
                          <div className="me-3">
                            <button
                              onClick={() =>
                                this.handleCustomDialogOpen(
                                  id,
                                  name,
                                  description
                                )
                              }
                              type="button"
                            >
                              Edit
                            </button>
                          </div>

                          <IconButton onClick={this.handleRemoveToSelected(id)}>
                            <Close sx={{ fontSize: "15px" }} />
                          </IconButton>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="benefit-container-empty">
                    <div fill="primary" className="me-2">
                      <WarningAmberOutlined
                        sx={{ color: "rgb(169, 139, 15)", width: "1rem" }}
                      />
                    </div>

                    <div>
                      <span color="dark">
                        You must have at least one benefit in your plan to save.
                        If your plan is donation-based,
                        <button
                          tabIndex="0"
                          type="button"
                          onClick={this.handleAddToSelected(
                            defaultBenefit.id,
                            defaultBenefit.name,
                            defaultBenefit.description
                          )}
                        >
                          add the General Support benefit
                        </button>
                        .
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog
          open={benefitDialogOpen}
          onClose={this.handleBenefitDialogClose}
          scroll={"paper"}
          maxWidth={"xs"}
        >
          <DialogTitle id="scroll-dialog-title">
            <div color="dark" style={{ display: "flex", alignItems: "start" }}>
              <div style={{ flexGrow: 1 }}>
                <div className="mt-2 dialog-title">Add a benefit</div>
                <div
                  style={{
                    color: "rgb(36, 30, 18)",
                    fontFamily: "aktiv-grotesk, sans-serif",
                    marginTop: "10px",
                    fontSize: "1rem",
                  }}
                >
                  Choose from this list of top recommended benefits for your
                  plan. You’ll be able to customize each benefit to fit your
                  brand and audience.
                </div>
              </div>

              <IconButton onClick={this.handleBenefitDialogClose}>
                <Close />
              </IconButton>
            </div>
          </DialogTitle>

          <DialogContent dividers={false}>
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                padding: "1.5rem 0",
                borderTop: "1px solid rgb(229, 227, 221)",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    color: "black",
                    marginBottom: "10px",
                  }}
                >
                  Custom benefit
                </div>
                <div>
                  You can edit everything about this benefit to provide a unique
                  reward to your subscribers
                </div>
              </div>

              <Button
                id={name}
                onClick={() => this.handleCustomDialogOpen()}
                className={"form-button form-button-sm light-button-active"}
              >
                Add
              </Button>
            </div>

            {benefits.map(({ id, name, description }) => {
              let isSelected = false;
              selectedBenefits.map((selectedBenefit) => {
                if (selectedBenefit.id === id) {
                  isSelected = true;
                  return;
                }
              });

              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "start",
                    padding: "1.5rem 0",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgb(229, 227, 221)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        color: "black",
                        marginBottom: "10px",
                      }}
                    >
                      {name}
                    </div>
                    <div>{description}</div>
                  </div>

                  <Button
                    id={name}
                    onClick={() =>
                      this.handleCustomDialogOpen(id, name, description)
                    }
                    className={
                      "form-button form-button-sm " +
                      (isSelected
                        ? "light-button-disabled"
                        : "light-button-active")
                    }
                  >
                    Add
                  </Button>
                </div>
              );
            })}
          </DialogContent>
        </Dialog>

        <Dialog
          open={customDialogOpen}
          keepMounted
          onClose={this.handleCustomDialogClose}
          maxWidth={"sm"}
        >
          <DialogTitle>
            <div color="dark" style={{ display: "flex", alignItems: "start" }}>
              <div style={{ flexGrow: 1 }}>
                <div className="mt-2 dialog-title">
                  {customBenefitNew ? "Create benefit" : benefitName}
                </div>

                <div
                  style={{
                    color: "rgb(36, 30, 18)",
                    fontFamily: "aktiv-grotesk, sans-serif",
                    marginTop: "10px",
                    fontSize: "1rem",
                  }}
                >
                  {customBenefitNew ? "" : benefitDescription}
                </div>
              </div>

              <IconButton onClick={this.handleCustomDialogClose}>
                <Close />
              </IconButton>
            </div>
          </DialogTitle>

          <DialogContent>
            <div
              style={
                customBenefitNew
                  ? {}
                  : {
                      padding: "1.5rem 0",
                      borderTop: "1px solid rgb(229, 227, 221)",
                    }
              }
              className={"project-input-container custom-benefit"}
            >
              <div className="project-label mb-3">
                <div style={{ color: "black" }} role="heading" aria-level="2">
                  Title
                </div>

                <span color="gray2">
                  Required <span style={{ color: "red" }}>*</span>
                </span>
              </div>

              <div className="project-input">
                <TextField
                  label="Name"
                  placeholder="e.g. Thank You Message"
                  type={"text"}
                  name="benefitName"
                  value={benefitName}
                  helperText={benefitNameError}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  onChange={this.handleInputChange("benefitName")}
                  onBlur={this.handleValidateBenefitInput(benefitID)}
                  error={benefitNameError !== "" ? true : false}
                />
              </div>
            </div>
          </DialogContent>

          <DialogActions sx={{ margin: "15px" }}>
            <Button
              className={"form-button form-button-sm light-button-active"}
              onClick={this.handleCustomDialogClose}
              status="active"
            >
              Cancel
            </Button>

            <Button
              className={
                addBenefitButtonStatus === "active"
                  ? "form-button form-button-sm form-button-active"
                  : "form-button form-button-sm form-button-disabled"
              }
              onClick={this.handleAddToSelected(
                benefitID,
                benefitName,
                benefitDescription
              )}
              status={addBenefitButtonStatus}
            >
              Add benefit
            </Button>
          </DialogActions>
        </Dialog>

        {addPlanResponse ? (
          <div
            class="mt-3 mb-4 alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <NotInterestedOutlined />
            <div className="ps-2">{addPlanResponse}</div>
          </div>
        ) : null}

        <div className="my-3">
          <Button onClick={this.handleAddPlan} status={addPlanButtonStatus}>
            Add Plan
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default ProjectPlan;
