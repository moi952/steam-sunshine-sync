import { Card, CardContent, CardMedia, Grid2, Typography, Box, CardActions } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

export type gameStatus = "new" | "updated" | "removed" | "nonExported" | "exported" | undefined;

interface GameCardProps {
  gameTitle: string;
  imagePath: string;
  status?: gameStatus;
  actions?: React.ReactNode;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ status, actions, gameTitle, imagePath, onClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const imageURL = `local://${imagePath.replace(/\\/g, "/")}`;
  const statusConfig = {
    new: {
      color: "green",
      text: t("general.gameStatusNew"),
    },
    updated: {
      color: "orange",
      text: t("general.gameStatusUpdated"),
    },
    removed: {
      color: "red",
      text: t("general.gameStatusRemoved"),
    },
    exported: {
      color: "green",
      text: t("general.appExported"),
    },
    nonExported: {
      color: "orange",
      text: t("general.appNonExported"),
    },
  };

  const getBackgroundColor = () => {
    if (status && statusConfig[status]) {
      return statusConfig[status].color;
    }

    return "";
  };

  const getStatus = () => {
    if (status && statusConfig[status]) {
      return statusConfig[status].text;
    }

    return "";
  };

  return (
    <Grid2 key={uuidv4()}>
      <Card
        onClick={onClick}
        sx={{
          width: 190,
          backgroundColor: theme.palette.background.paper,
          position: "relative",
          ...(onClick && { cursor: "pointer" }),
          ...(actions && {
            "&:hover .cardActions": {
              display: "flex",
            },
          }),
        }}
      >
        {status && (
          <Box
            sx={{
              position: "absolute",
              top: 5,
              left: 5,
              backgroundColor: getBackgroundColor(),
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            {getStatus()}
          </Box>
        )}
        <CardMedia
          component="div"
          image={imageURL}
          sx={{
            height: 0,
            paddingTop: "150%",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          title={gameTitle}
        />
        <CardContent
          sx={{
            paddingX: "10px",
            paddingY: "10px",
            paddingBottom: "10px!important",
          }}
        >
          <Typography variant="body2" component="div" noWrap>
            <b>{gameTitle}</b>
          </Typography>
        </CardContent>
        {actions && (
          <CardActions
            className="cardActions"
            sx={{
              position: "absolute",
              width: "100%",
              justifyContent: "center",
              bottom: "40px",
              display: "none",
              // backgroundColor: theme.palette.background.paper,
              gap: 1,
            }}
          >
            {actions}
          </CardActions>
        )}
      </Card>
    </Grid2>
  );
};

export default GameCard;
