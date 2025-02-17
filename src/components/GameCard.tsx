import { Card, CardContent, CardMedia, Grid2, Typography, Box } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { SteamGame } from "steam-library-scanner";
import { useTranslation } from "react-i18next";

export type gameStatus = "new" | "updated" | "removed" | undefined;

interface GameCardProps {
  game: SteamGame;
  status?: gameStatus;
}

const GameCard: React.FC<GameCardProps> = ({ game, status }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const imageURL = `local://${game.imagePath.replace(/\\/g, "/")}`;

  const getBackgroundColor = () => {
    if (status === "new") return "green";
    if (status === "updated") return "orange";
    if (status === "removed") return "red";

    return "";
  };

  const getStatus = () => {
    if (status === "new") return t("general.gameStatusNew");
    if (status === "updated") return t("general.gameStatusUpdated");
    if (status === "removed") return t("general.gameStatusRemoved");

    return "";
  };

  return (
    <Grid2 key={game.name}>
      <Card
        sx={{
          width: 190,
          backgroundColor: theme.palette.background.paper,
          position: "relative",
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
          title={game.name}
        />
        <CardContent
          sx={{
            paddingX: "10px",
            paddingY: "10px",
            paddingBottom: "10px!important",
          }}
        >
          <Typography variant="body2" component="div" noWrap>
            <b>{game.name}</b>
          </Typography>
        </CardContent>
      </Card>
    </Grid2>
  );
};

export default GameCard;
