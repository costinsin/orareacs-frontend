import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getAccessRole, revalidateAccessToken } from "../../utils/tokens";
import axios from "axios";
import { toast } from "react-toastify";

export default function Customize({ setUserType, setCustomizePage }) {
  const [ruleList, setRuleList] = useState([]);

  function addRule(rule) {
    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "student")
        return;

      // Add rule
      let addRulePromise = axios.post(
        "https://orareacs-backend.herokuapp.com/api/rule",
        {
          type: "add",
          course: {
            name: "MK",
            type: "lab",
            frequency: "weekly",
            startDate: new Date(Date.now() + 20000000),
            endDate: new Date(Date.now() + 30000000),
            startHour: "12:00",
            endHour: "14:00",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      // Show toast notification to inform user about what is happening
      toast.promise(addRulePromise, {
        pending: "Adding new customization rule... ⏳",
        success: {
          render(result) {
            setRuleList(result.data.data);

            return "Customization rule added sucessfully ➕";
          },
        },
        error: {
          render(result) {
            console.log(result);
            if (
              result.data.response !== undefined &&
              result.data.response.data.message !== undefined
            )
              return result.data.response.data.message;
            else
              return "An error has occurred while fetching the customization rules";
          },
        },
      });
    });
  }

  useEffect(() => {
    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "student")
        return;

      // Get timetable
      let rulesPromise = axios.get(
        "https://orareacs-backend.herokuapp.com/api/rule",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      // Show toast notification to inform user about what is happening
      toast.promise(rulesPromise, {
        pending: "Loading customization rules... ⏳",
        success: {
          render(result) {
            console.log(result.data.data)
            setRuleList(result.data.data);

            return "Customization rules loaded sucessfully 🔮";
          },
        },
        error: {
          render(result) {
            if (
              result.data.response !== undefined &&
              result.data.response.data.message !== undefined
            )
              return result.data.response.data.message;
            else
              return "An error has occurred while fetching the customization rules";
          },
        },
      });
    });
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          setCustomizePage(false);
        }}
      >
        {" "}
        Return to timetable
      </Button>
      <Button
        onClick={() => {
          addRule();
        }}
      >
        {" "}
        add rule
      </Button>
    </>
  );
}
