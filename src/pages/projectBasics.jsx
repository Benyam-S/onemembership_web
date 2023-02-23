import {
  ArrowForward,
  CameraOutlined,
  NotInterestedOutlined,
} from "@mui/icons-material";
import { TextField } from "@mui/material";
import axios from "axios";
import { sentenceCase } from "../tools/strings";
import React, { Component, Fragment } from "react";
import Button from "../components/form/button";
import { BASE_URL } from "../entity/constants";
import "../style/project.css";

class ProjectBasics extends Component {
  state = {
    name: "",
    nameError: "",
    projectLink: "",
    projectLinkError: "",
    description: "",
    descriptionError: "",
    addProjectButtonStatus: "disabled",
    projectImage: null,
    projectImageURL: "https://c8.patreon.com/2/200/c7907809",
    projectImageError: "",
    coverImage: null,
    coverImageURL: "",
    coverImageError: "",
    addProjectResponse: "",
  };

  validateInput = (inputs) => {
    const { name, projectLink, description, projectImage, coverImage } = inputs;

    const isValidName = name.length >= 1 && name.length <= 1000;
    const isValidProjectLink = /^\w+$/.test(projectLink);
    const isValidDescription = description.length <= 2000;
    const isValidProjectImage = projectImage
      ? projectImage.size <= 20000000
      : false;
    const isValidCoverImage = coverImage ? coverImage.size <= 20000000 : false;

    return {
      name: isValidName,
      projectLink: isValidProjectLink
        ? projectLink.length > 20
          ? "size_error"
          : true
        : false,
      description: isValidDescription,
      projectImage: isValidProjectImage,
      coverImage: isValidCoverImage,
    };
  };

  // Validating the input value
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
    newState["addProjectResponse"] = "";

    if (isFormValid) {
      newState["addProjectButtonStatus"] = "active";
    } else {
      newState["addProjectButtonStatus"] = "disabled";
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
        newState["nameError"] = "Please enter valid project name.";
      } else {
        newState["nameError"] = "";
      }
    } else if (props === "projectLink") {
      const isValidProjectLink = this.validateInput(newState)["projectLink"];
      if (!isValidProjectLink) {
        newState["projectLinkError"] =
          "Project link shouldn't contain space or any special characters.";
      } else if (isValidProjectLink == "size_error") {
        newState["projectLinkError"] =
          "Project link should not be longer than 20 characters.";
      } else {
        newState["projectLinkError"] = "";
      }
    } else if (props === "description") {
      const isValidDescription = this.validateInput(newState)["description"];
      if (!isValidDescription) {
        newState["descriptionError"] =
          "Project description should not be longer than 2000 characters.";
      } else {
        newState["descriptionError"] = "";
      }
    } else if (props === "projectImage") {
      const isValidProjectImage = this.validateInput(newState)["projectImage"];
      if (!isValidProjectImage) {
        newState["projectImageError"] =
          "Image exceeds the file size limit, 20MB.";
      } else {
        newState["projectImageError"] = "";
      }
    } else if (props === "coverImage") {
      const isValidCoverImage = this.validateInput(newState)["coverImage"];
      if (!isValidCoverImage) {
        newState["coverImageError"] =
          "Image exceeds the file size limit, 20MB.";
      } else {
        newState["coverImageError"] = "";
      }
    }

    this.setState(newState);
  };

  // Controlling input value
  handleInputChange = (props) => (event) => {
    this.setState({ [props]: event.target.value });
  };

  onImageChange = (props) => (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      const imageURL = URL.createObjectURL(image);

      if (props === "projectImage") {
        this.setState({
          projectImage: image,
          projectImageURL: imageURL,
        });
      } else if (props === "coverImage") {
        this.setState({
          coverImage: image,
          coverImageURL: imageURL,
        });
      }

      // In order to activate the add button
      setTimeout(() => this.handleValidateInput(props)(event), 500);
    }
  };

  // handles request for adding new project
  handleAddProject = (event) => {
    // Start loading
    this.setState({
      nameError: "",
      projectLinkError: "",
      descriptionError: "",
      projectImageError: "",
      coverImageError: "",
      addProjectResponse: "",
      addProjectButtonStatus: "loading",
    });

    const { name, projectLink, description, projectImage, coverImage } =
      this.state;

    const { onNext, setProject } = this.props;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("project_link", projectLink);
    formData.append("description", description);
    formData.append("project_image", projectImage);
    formData.append("cover_image", coverImage);

    // Binding this to that
    const that = this;

    axios
      .post(BASE_URL + "project/add", formData, {
        "Content-Type": "multipart/form-data",
      })
      .then(function (response) {
        if (response) {
          const project = response.data;

          // Setting the project
          setProject(project);

          // Going to the next step
          onNext();
        } else {
          that.setState({
            addProjectResponse: "Sorry! Unable to add new project.",
            addProjectButtonStatus: "active",
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          that.setState({
            nameError: data["name"] ? sentenceCase(data["name"] + ".") : "",
            projectLinkError: data["project_link"]
              ? sentenceCase(data["project_link"] + ".")
              : "",
            descriptionError: data["description"]
              ? sentenceCase(data["description"] + ".")
              : "",
            projectImageError: data["project_image"]
              ? sentenceCase(data["project_image"] + ".")
              : "",
            coverImageError: data["cover_image"]
              ? sentenceCase(data["cover_image"] + ".")
              : "",
            addProjectResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Unable to add new project."
                : data["error"]
                ? data["error"]
                : "",
            addProjectButtonStatus: "active",
          });
        } else {
          that.setState({
            addProjectResponse: "Sorry! Unable to add new project.",
            addProjectButtonStatus: "active",
          });
        }
      });

    event.preventDefault();
  };

  render() {
    const {
      name,
      projectLink,
      description,
      nameError,
      projectLinkError,
      descriptionError,
      projectImageURL,
      projectImageError,
      coverImageURL,
      coverImageError,
      addProjectButtonStatus,
      addProjectResponse,
    } = this.state;

    return (
      <Fragment>
        <div className="project-title-container">
          <h1 color="dark">Basics</h1>
          <p color="gray2">Set your project details</p>
        </div>

        <div className="project-basic-segment">
          <div className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Name of Project
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
                onChange={this.handleInputChange("name")}
                onBlur={this.handleValidateInput("name")}
                fullWidth
                error={nameError !== "" ? true : false}
              />
            </div>
          </div>

          <div className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Unique name to identify your project
              </div>

              <span color="gray2">
                Required <span style={{ color: "red" }}>*</span>
              </span>
            </div>

            <div className="project-input">
              <TextField
                label="Link"
                type={"text"}
                name="link"
                value={projectLink}
                helperText={projectLinkError}
                onChange={this.handleInputChange("projectLink")}
                onBlur={this.handleValidateInput("projectLink")}
                fullWidth
                error={projectLinkError !== "" ? true : false}
              />
            </div>
          </div>

          <div className="d-block project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Describe your project for subscribers
              </div>

              <span color="gray2" style={{ display: "block" }}>
                Optional
              </span>

              <span
                color="gray2"
                style={{ display: "block", margin: "20px 0px" }}
              >
                This is the first thing potential subscriber will see when they
                land on your project, so make sure you paint a compelling
                picture of how they can join you on this journey.
              </span>
            </div>

            <div className="project-input">
              <TextField
                label="Description"
                type={"text"}
                name="description"
                multiline={true}
                rows={6}
                sx={{ ".MuiOutlinedInput-input": { fontSize: "0.85rem" } }}
                value={description}
                helperText={descriptionError}
                onChange={this.handleInputChange("description")}
                onBlur={this.handleValidateInput("description")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                error={descriptionError !== "" ? true : false}
              />
            </div>
          </div>
        </div>

        <div className="project-basic-segment">
          <div className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Project photo
              </div>
              <span
                color="gray2"
                style={{ display: "block", marginBottom: "10px" }}
              >
                Required <span style={{ color: "red" }}>*</span>
              </span>
              <span color="gray2" style={{ display: "block" }}>
                We recommend a 256px by 256px image.
              </span>
            </div>

            <div className="w-100">
              <div
                display="block"
                style={{
                  backgroundImage: `url(${projectImageURL})`,
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
                        name="projectImage"
                        accept="image/*"
                        onChange={this.onImageChange("projectImage")}
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
                  {projectImageError}
                </span>
              </div>
            </div>
          </div>

          <div data-tag="cover-image" className="project-input-container">
            <div className="project-label">
              <div role="heading" aria-level="2">
                Cover photo
              </div>
              <span
                color="gray2"
                style={{ display: "block", marginBottom: "10px" }}
              >
                Required <span style={{ color: "red" }}>*</span>
              </span>
              <span color="gray2" style={{ display: "block" }}>
                We recommend an image at least 1600px wide and 400px tall.
              </span>
            </div>

            <div className="w-100">
              <div
                display="block"
                style={{
                  backgroundImage: `url(${coverImageURL})`,
                }}
                className="cover-img-block img-block"
              >
                <div
                  id="cover-overlay-block"
                  data-tag="overlay"
                  className="img-overlay-block"
                >
                  <label>
                    <div className="d-none">
                      <input
                        name="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={this.onImageChange("coverImage")}
                        aria-describedby="cover-photo-input-description"
                      ></input>
                    </div>

                    <div className="img-overly-icon">
                      <CameraOutlined />

                      <div color="light">
                        Edit Cover Photo
                        <div
                          color="light"
                          style={{ fontSize: "0.62rem", marginTop: "5px" }}
                        >
                          (1,600px x 400px)
                        </div>
                      </div>
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
                  {coverImageError}
                </span>
              </div>
            </div>
          </div>
        </div>

        {addProjectResponse ? (
          <div
            className="mt-3 mb-4 alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <NotInterestedOutlined />
            <div className="ps-2">{addProjectResponse}</div>
          </div>
        ) : null}

        <div className="my-3">
          <Button
            onClick={this.handleAddProject}
            status={addProjectButtonStatus}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Next Step</span> <ArrowForward sx={{ ml: 1 }} />
            </div>
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default ProjectBasics;
