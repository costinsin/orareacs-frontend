import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getAccessRole, revalidateAccessToken } from "../../../utils/tokens";
import axios from "axios";
import { toast } from "react-toastify";
import RuleContainer from "./RuleContainer";

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
        rule,
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
            fetchRules(false);

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
              return "An error has occurred while adding the customization rule";
          },
        },
      });
    });
  }

  function deleteRule(rule) {
    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "student")
        return;

      // Add rule
      let deleteRulePromise = axios.delete(
        `https://orareacs-backend.herokuapp.com/api/rule/${rule.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      // Show toast notification to inform user about what is happening
      toast.promise(deleteRulePromise, {
        pending: "Deleting customization rule... ⏳",
        success: {
          render(result) {
            fetchRules(false);

            return "Customization rule deleted sucessfully 🗑️";
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
              return "An error has occurred while deleting the customization rule";
          },
        },
      });
    });
  }

  function fetchCourses(setCourses) {
    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "student")
        return;

      // Get courses
      let coursesPromise = axios.get(
        "https://orareacs-backend.herokuapp.com/api/course",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      coursesPromise
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  function fetchRules(displayToast) {
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

      if (displayToast) {
        // Show toast notification to inform user about what is happening
        toast.promise(rulesPromise, {
          pending: "Loading customization rules... ⏳",
          success: {
            render(result) {
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
      } else {
        rulesPromise
          .then((result) => {
            setRuleList(result.data);
          })
          .catch((result) => {
            if (
              result.response !== undefined &&
              result.response.data.message !== undefined
            )
              return result.response.data.message;
            else
              return "An error has occurred while fetching the customization rules";
          });
      }
    });
  }

  useEffect(() => {
    fetchRules(true);
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          setCustomizePage(false);
        }}
      >
        {" "}
        Return to Timetable
      </Button>
      <div className="d-flex justify-content-center align-items-center h-100">
        <RuleContainer
          ruleList={ruleList}
          addRule={addRule}
          deleteRule={deleteRule}
          fetchCourses={fetchCourses}
        />
      </div>
    </>
  );
}
