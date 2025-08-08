import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  SvgIconProps,
  Divider,
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
  icon?: React.ReactElement<SvgIconProps>;

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

  /**
   * Color for the value text
   */
  valueColor?: string;
}

/**
 * StatCard - A reusable component for displaying statistics in a card format
 *
 * Use this component to display key metrics and statistics in a visually
 * appealing card format with consistent styling across the application.
 * Styled to resemble Material Tailwind cards.
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  backgroundColor = "transparent", // Transparent background
  textColor = "text.primary",
  iconColor = "primary.main",
  elevation = 0,
  valueColor = "#1e293b", // blue-gray color
}) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        height: "100%",
        bgcolor: backgroundColor,
        color: textColor,
        borderRadius: 2,
        border: "none",
        // Apply subtle shadow even when elevation is 0
        boxShadow:
          elevation === 0
            ? "0px 2px 6px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.04)"
            : undefined,
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow:
            "0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {icon && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 1,
            }}
          >
            {React.cloneElement(icon, {
              fontSize: "large",
              sx: { color: iconColor },
            })}
          </Box>
        )}

        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: "2.25rem", // text-4xl equivalent
            mb: 1,
            color: valueColor,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </Typography>

        <Divider
          sx={{
            maxWidth: "5rem",
            my: 2,
            borderColor: "rgba(0,0,0,0.12)",
          }}
        />

        <Typography
          variant="h5"
          sx={{
            mt: 1,
            mb: 1,
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1e293b", // blue-gray color
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.75,
            color: "rgba(107, 114, 128, 1)", // text-gray-500 equivalent
            maxWidth: "20rem", // max-w-xs equivalent
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
