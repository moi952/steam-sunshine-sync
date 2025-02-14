import { Card, CardContent, CardMedia, Grid2, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { SteamGame } from "steam-library-scanner";

interface GameCardProps {
  game: SteamGame;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const theme = useTheme();
  const imageURL = `local://${game.imagePath.replace(/\\/g, "/")}`;

  return (
    <Grid2 key={game.name}>
      <Card
        sx={{
          minWidth: 160,
          maxWidth: 190,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Using a div with background image to maintain a 2:3 aspect ratio */}
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
