import { React, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Views } from "react-big-calendar";
import axios from "axios";
import { toast } from "react-toastify";
import { getAccessRole, revalidateAccessToken } from "../../utils/tokens";
import { Button } from "react-bootstrap";

export default function TimetableView({ setUserType, setCustomizePage }) {
  const localizer = momentLocalizer(moment);
  // Dummy events
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) === "") return;

      // Get timetable
      let timetablePromise = axios.get(
        "https://orareacs-backend.herokuapp.com/api/timetable",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      // Show toast notification to inform user about what is happening
      toast.promise(timetablePromise, {
        pending: "Loading timetable... ⏳",
        success: {
          render(result) {
            // Dumb fix for timezones
            setEvents(
              result.data.data.map((e) => {
                return {
                  title: e.title,
                  start: new Date(
                    new Date(e.start).getTime() +
                      new Date(e.start).getTimezoneOffset() * 60 * 1000
                  ),
                  end: new Date(
                    new Date(e.end).getTime() +
                      new Date(e.end).getTimezoneOffset() * 60 * 1000
                  ),
                };
              })
            );

            return "Timetable loaded sucessfully 📅";
          },
        },
        error: {
          render(result) {
            console.log(result.data.response.data.message);
            if (
              result.data.response !== undefined &&
              result.data.response.data.message !== undefined
            )
              return result.data.response.data.message;
            else return "An error has occurred while fetching the timetable";
          },
        },
      });
    });
  }, [setUserType]);

  return (
    <>
      <Button
        onClick={() => {
          setCustomizePage(true);
        }}
      >
        Customize Timetable
      </Button>
      <div className="d-flex justify-content-center align-items-center h-100">
        <div
          style={{
            marginLeft: "1rem",
            marginRight: "1rem",
            maxWidth: "1300px",
            maxHeight: "675px",
          }}
          className="w-100"
        >
          <Calendar
            defaultDate={new Date(Date.now())}
            localizer={localizer}
            dayLayoutAlgorithm={"no-overlap"}
            defaultView={window.innerWidth < 1020 ? Views.DAY : Views.WEEK}
            views={{ week: true, day: true }}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            events={events}
            eventPropGetter={eventPropGetter}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Function for changing event styles
 */
function eventPropGetter(event, start, end, isSelected) {
  let newStyle = {
    backgroundColor: "lightgrey",
    color: "black",
    borderRadius: "10px",
    border: "solid black 1px",
  };

  if (event.title.includes("Lab")) {
    newStyle.backgroundColor = "lightgreen";
  } else if (event.title.includes("Course")) {
    newStyle.backgroundColor = "indianred";
  }

  return {
    style: newStyle,
  };
}
