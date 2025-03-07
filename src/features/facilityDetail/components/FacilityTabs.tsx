import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import DescriptionTab from "./DescriptionTab";
import PricingTab from "./PricingTab";
import AmenitiesTab from "./AmenitiesTab";
import AvailabilityTab from "./AvailabilityTab";
import PoliciesTab from "./PoliciesTab";
import { Facility } from "../../../types/facilityDetails";

interface FacilityTabsProps {
  facility: Facility;
  customerType: string;
  onCustomerTypeChange: (event: { target: { value: string } }) => void;
  onBookNow: () => void;
}

const FacilityTabs: React.FC<FacilityTabsProps> = ({
  facility,
  customerType,
  onCustomerTypeChange,
  onBookNow,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Description" />
          <Tab label="Pricing" />
          <Tab label="Amenities" />
          <Tab label="Availability" />
          <Tab label="Policies" />
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <DescriptionTab facility={facility} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <PricingTab
          facility={facility}
          customerType={customerType}
          onCustomerTypeChange={onCustomerTypeChange}
          onBookNow={onBookNow}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <AmenitiesTab amenities={facility.amenities} />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <AvailabilityTab
          availability={facility.availability}
          onBookNow={onBookNow}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <PoliciesTab policies={facility.policies} />
      </TabPanel>
    </Box>
  );
};

function TabPanel(props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`facility-tabpanel-${index}`}
      aria-labelledby={`facility-tab-${index}`}
      style={{ padding: "24px 0" }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default FacilityTabs;
