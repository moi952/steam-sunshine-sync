import { Select, MenuItem, Box, Typography } from "@mui/material";
import { ScannedGamesConfig } from "../types";

interface GameDropdownProps {
  games: ScannedGamesConfig[];
  selectedGame?: string;
  onChange: (_scannedGameUniqueId: string) => void;
  placeholder: string;
}

const GameDropdown = ({ games, selectedGame, onChange, placeholder }: GameDropdownProps) => {
  const getImage = (src: string, gameName: string) => (
    <img
      src={`local://${src}`}
      alt={gameName}
      style={{
        height: "50px",
        width: "auto",
        maxWidth: "35px",
        marginRight: "10px",
        objectFit: "contain",
      }}
    />
  );
  return (
    <Select
      value={selectedGame}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      fullWidth
      renderValue={(selected) => {
        const game = games.find((g) => g.uniqueId === selected);
        if (!game) return placeholder; // Default text

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {getImage(game.gameDetails.imagePath, game.gameDetails.name)}
            <Typography variant="body1">{game.gameDetails.name}</Typography>
          </Box>
        );
      }}
    >
      <MenuItem key={placeholder} value="">
        {placeholder}
      </MenuItem>
      {games.map((game) => (
        <MenuItem key={game.uniqueId} value={game.uniqueId}>
          {getImage(game.gameDetails.imagePath, game.gameDetails.name)}
          {game.gameDetails.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default GameDropdown;
