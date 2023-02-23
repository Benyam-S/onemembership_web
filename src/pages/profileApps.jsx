import React, { Component } from "react";
import Button from "../components/form/button";
import axios from "axios";
import { BASE_URL } from "../entity/constants";
import InputAdornment from "@mui/material/InputAdornment";
import { sentenceCase } from "change-case";
import {
  Facebook,
  Google,
  LockOutlined,
  Telegram,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import OAppBar from "../components/navigation/topNavigation";
import { IconButton, TextField } from "@mui/material";

function ProfileApps() {
  return (
    <div>
      <div
        className="profile-segment-1"
        style={{ borderBottom: "1px solid rgb(229, 227, 221)" }}
      >
        <div className="profile-segment-title">
          <div className="segment-title-header">
            <span color="dark">Third-party apps</span>
          </div>

          <div className="segment-title-sub">
            <span color="gray2">
              You gave these apps access to some of your Patreon data in order
              to receive benefits from your memberships.
            </span>
          </div>
        </div>

        <div className="profile-segment-entry d-flex flex-row flex-wrap align-items-center">
          <div
            style={{
              fontFamily: "aktiv-grotesk, sans-serif",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexGrow: 2,
            }}
          >
            <Telegram />
            <div className="ms-3">
              <div>
                <span
                  style={{
                    color: "rgb(36, 30, 18)",
                    fontWeight: "500 ",
                  }}
                >
                  Telegram
                </span>
              </div>
              <div>
                <span
                  style={{
                    color: "rgb(112, 108, 100)",
                    textOverflow: "ellipsis",
                    fontWeight: "400",
                  }}
                >
                  Add telegram connectivity for your account.
                </span>
              </div>
            </div>
          </div>

          <div style={{ flexGrow: 1 }}>
            <button className="profile-connect-button">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileApps;
