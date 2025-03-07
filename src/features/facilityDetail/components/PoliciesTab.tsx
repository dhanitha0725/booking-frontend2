import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Check } from "@mui/icons-material";

interface PoliciesTabProps {
  policies: string[];
}

const PoliciesTab: React.FC<PoliciesTabProps> = ({ policies }) => {
  return (
    <List>
      {policies.map((policy, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Check color="primary" />
          </ListItemIcon>
          <ListItemText primary={policy} />
        </ListItem>
      ))}
    </List>
  );
};

export default PoliciesTab;
