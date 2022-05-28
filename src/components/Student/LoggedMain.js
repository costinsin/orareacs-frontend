import { React, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Customize from "./Customize/Customize";
import TimetableView from "./TimetableView";

export default function LoggedMain({ setUserType }) {
  const [customizePage, setCustomizePage] = useState(false);

  if (customizePage) {
    return (
      <Customize
        setUserType={setUserType}
        setCustomizePage={setCustomizePage}
      />
    );
  } else {
    return (
      <TimetableView
        setUserType={setUserType}
        setCustomizePage={setCustomizePage}
      />
    );
  }
}
