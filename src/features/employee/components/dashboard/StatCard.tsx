import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  SvgIconProps,
} from "@mui/material";

interface StatCardProps {
  /**
   * Title displayed at the top of the card
   */
  title: string;

  /**
   * The main value/statistic to display
   */
  value: string | number;

  /**
   * Supporting description text shown below the value
   */
  description: string;

  /**
   * Material UI icon component to display
   */
  icon: React.ReactElement<SvgIconProps>;

  /**
   * Background color of the card
   * @example "primary.light", "warning.light"
   */
  backgroundColor?: string;

  /**
   * Text color for the card contents
   * @example "primary.contrastText"
   */
  textColor?: string;

  /**
   * Color for the icon
   * @example "primary.main", "warning.main"
   */
  iconColor?: string;

  /**
   * Shadow elevation for the card
   */
  elevation?: number;
}

/**
 * StatCard - A reusable component for displaying statistics in a card format
 *
 * Use this component to display key metrics and statistics in a visually
 * appealing card format with consistent styling across the application.
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  backgroundColor = "#e3e3e3", // White background
  textColor = "text.primary", // Black text
  iconColor = "primary.main",
  elevation = 1,
}) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        height: "100%",
        bgcolor: backgroundColor,
        color: textColor,
        borderRadius: 2,
        border: "1px rgb(0, 0, 0)",
        boxShadow: "4px",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="medium">
            {title}
          </Typography>
          {React.cloneElement(icon, {
            fontSize: "large",
            sx: { color: iconColor }, // Apply the color to the icon
          })}
        </Box>

        <Typography
          variant={typeof value === "number" && value > 999 ? "h4" : "h3"}
          component="div"
          fontWeight="bold"
          noWrap={typeof value === "string" && value.length > 15}
        >
          {value}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
