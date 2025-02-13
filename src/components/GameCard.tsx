import { Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { SteamGame } from "steam-library-scanner";

interface GameCardProps {
  game: SteamGame;
}
interface SunshineApp {
  name: string;
  cmd: string;
  detached?: boolean;
  output?: string;
  "prep-cmd"?: string[];
  "working-dir"?: string;
}

function formatSteamGameForSunshine(game: SteamGame): SunshineApp {
  // return {
  //   name: game.Name,
  //   cmd: game.Cmd,
  //   detached: true
  // };
  return {
    name: game.name,
    cmd: `steam://rungameid/99999`,
    // cmd: `steam://rungameid/${game.AppID}`,
    detached: true,
    // "working-dir": path.dirname(game.path)
  };
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const theme = useTheme();
  const imageURL = `local://${game.imagePath.replace(/\\/g, "/")}`;

  const handleAddToSunshine = async () => {
    const sunshineApp = formatSteamGameForSunshine(game);
    await window.electron.addToSunshine(sunshineApp);
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={game.name}>
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
          <Button onClick={handleAddToSunshine}>Add to Sunshine</Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GameCard;
