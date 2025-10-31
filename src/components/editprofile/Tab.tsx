import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Checklist from "./CheckList";
import UserProfile from "./UserProfile";
import EditProfileForm from "./EditProfile";
import { useAppSelector } from "../../redux/hooks";
import { callGetUserProfile } from "../../config/api";

const mapUserProfileToFormData = (profile: any): ProfileData => {
  console.log("mapping profile", profile);
  return {
    birthYear: profile.age
      ? String(new Date().getFullYear() - profile.age)
      : "",
    gender:
      profile.gender === "MALE"
        ? "Male"
        : profile.gender === "FEMALE"
        ? "Female"
        : "Non-binary",
    country: profile.country || "",
    zip: profile.zipcode || "",
    income: profile.householdIncome || "",
    hasChildren: profile.isChildren ? "Yes" : "No",
    employment: profile.employment || "",
    education: profile.education || "", 
    gamingGenres: profile.gamingGenres
      ? profile.gamingGenres.split(",").map((s: string) => s.trim())
      : [],
    browsers: profile.browsers
      ? profile.browsers.split(",").map((s: string) => s.trim())
      : [],
    socialNetworks: [], // backend chưa có trường này
    webExpertise: profile.webExpertise || "",
    languages: profile.language
      ? profile.language.split(",").map((s: string) => s.trim())
      : [],
    devices: {
      computer: profile.computer
        ? profile.computer.split(",").map((s: string) => s.trim())
        : [],
      smartphone: profile.smartPhone
        ? profile.smartPhone.split(",").map((s: string) => s.trim())
        : [],
      tablet: profile.tablet
        ? profile.tablet.split(",").map((s: string) => s.trim())
        : [],
      other: profile.otherDevice
        ? profile.otherDevice.split(",").map((s: string) => s.trim())
        : [],
    },
  };
};

const convertProfileToArray = (profileData: ProfileData) => {
  return [
    { label: "Birth Year", value: profileData.birthYear },
    { label: "Gender", value: profileData.gender },
    { label: "Country", value: profileData.country },
    { label: "ZIP Code", value: profileData.zip },
    { label: "Income", value: profileData.income },
    { label: "Has Children", value: profileData.hasChildren },
    { label: "Employment", value: profileData.employment },
    { label: "Education", value: profileData.education },
    { label: "Gaming Genres", value: profileData.gamingGenres.join(", ") },
    { label: "Browsers", value: profileData.browsers.join(", ") },
    { label: "Web Expertise", value: profileData.webExpertise },
    { label: "Languages", value: profileData.languages.join(", ") },
    { label: "Computer", value: profileData.devices.computer.join(", ") },
    { label: "Smartphone", value: profileData.devices.smartphone.join(", ") },
    { label: "Tablet", value: profileData.devices.tablet.join(", ") },
    { label: "Other Devices", value: profileData.devices.other.join(", ") },
  ];
};

export function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  // Call API

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const convertArrayToProfileData = (
  arr: { label: string; value: string }[]
): ProfileData => ({
  birthYear: arr.find((i) => i.label === "Birth Year")?.value || "",
  gender: arr.find((i) => i.label === "Gender")?.value || "",
  country: arr.find((i) => i.label === "Country")?.value || "",
  zip: arr.find((i) => i.label === "ZIP Code")?.value || "",
  income: arr.find((i) => i.label === "Income")?.value || "",
  hasChildren: arr.find((i) => i.label === "Has Children")?.value || "",
  employment: arr.find((i) => i.label === "Employment")?.value || "",
  education: arr.find((i) => i.label === "Education")?.value || "",
  gamingGenres:
    arr
      .find((i) => i.label === "Gaming Genres")
      ?.value?.split(",")
      .map((s) => s.trim()) || [],
  browsers:
    arr
      .find((i) => i.label === "Browsers")
      ?.value?.split(",")
      .map((s) => s.trim()) || [],
  socialNetworks: [],
  webExpertise: arr.find((i) => i.label === "Web Expertise")?.value || "",
  languages:
    arr
      .find((i) => i.label === "Languages")
      ?.value?.split(",")
      .map((s) => s.trim()) || [],
  devices: {
    computer:
      arr
        .find((i) => i.label === "Computer")
        ?.value?.split(",")
        .map((s) => s.trim()) || [],
    smartphone:
      arr
        .find((i) => i.label === "Smartphone")
        ?.value?.split(",")
        .map((s) => s.trim()) || [],
    tablet:
      arr
        .find((i) => i.label === "Tablet")
        ?.value?.split(",")
        .map((s) => s.trim()) || [],
    other:
      arr
        .find((i) => i.label === "Other Devices")
        ?.value?.split(",")
        .map((s) => s.trim()) || [],
  },
});

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState<any[]>([]);
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isAuthenticated && user) {
          const res = await callGetUserProfile(user.id);
          console.log("fetched profile", res.data);
          const profileData = mapUserProfileToFormData(res.data);
          const profileArray = convertProfileToArray(profileData);
          setProfile(profileArray);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  console.log("user in Tab.tsx", user);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Checklist" {...a11yProps(0)} />
          <Tab label="Test history" {...a11yProps(1)} />
          <Tab label="My Profile" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Checklist />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}></CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {!isEditing ? (
          <UserProfile profile={profile} onEdit={handleEdit} />
        ) : (
          <EditProfileForm
            userId={user?.id || ""}
            initialData={convertArrayToProfileData(profile)}
            onSave={(updated) => console.log("saved", updated)}
            onCancel={handleCancel}
          />
        )}
      </CustomTabPanel>
    </Box>
  );
}
