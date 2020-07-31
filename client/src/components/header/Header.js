import React, {useState} from "react";
import Title from "./Title";
import { Button, Popover } from "@material-ui/core";
import ReactGA from "react-ga";
import { useQuery, gql } from "@apollo/client";

import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";

export const GET_USER_INFO = gql`
  query UserQuery {
    userOne {
      netid
      firstName
      lastName
      majors
      phone
      token
      recentUpdate
      _id
    }
  }
`;

function Header() {
  // tracks whether popover is open
  const [showSettings, setShowSettings] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  let user = {
    netid: "netId",
    firstName: "",
    lastName: "",
    majors: [],
  };

  const { data } = useQuery(GET_USER_INFO);
  if (data) {
    user = data.userOne;
  }
  console.log('user ' , user);

  // Where we collect feedback
  let feedbackURL = "https://forms.gle/6uyRuTxKgP3n53vB6";

  // This initializes Google Analytics
  initGA();

  // Redirects people to our Medium page on a new page if they click our logo to learn more about us
  const handleLogoClick = () => {
    OutboundLink(
      "Clicked Logo.",
      window.open("https://medium.com/riceapps", "_blank")
    );
  };

  return (
    <div style={{ display: "float" }}>
      <div style={{ textAlign: "center" }}>
        <Title />
        <img
          src={RiceAppsLogo}
          style={styles.logo}
          onClick={() => handleLogoClick()}
        />
        <Button
          variant="outlined"
          style={styles.feedback}
          onClick={() => window.open(feedbackURL, "_blank")}
        >
          Feedback?
        </Button>
        <Button
          variant="outlined"
          style={styles.userSettingButton}
          onClick={evt => { 
              setShowSettings(!showSettings);
              setAnchorEl(evt.currentTarget);
            }
          }
        >
          {user.netid}
        </Button>
        <Popover 
          open = {showSettings}
          anchorEl = {anchorEl}
          onClose = {() => setShowSettings(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <p>net id: {user.netid}</p>
          <p>name: {user.firstName + " " + user.lastName}</p>
          <p>major: {user.majors}</p>
        </Popover>
      </div>
    </div>
  );
}

const styles = {
  feedback: {
    float: "right",
    marginTop: "-50px",
    marginRight: "2vw",
  },
  logo: {
    float: "left",
    marginTop: "-70px",
    marginLeft: "2vw",
    width: "5%",
    height: "5%",
  },
  userSettingButton: {
    float: "right",
    marginTop: "-50px",
    marginRight: "12vw"
  }
};

export default Header;
