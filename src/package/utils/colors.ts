import { colors } from "@mui/material";

type ColorKeys = keyof typeof colors;

export const getRandomColor = () => {
  const colorKeys = Object.keys(colors) as ColorKeys[];
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  const colorShades = Object.values(colors[randomKey]);
  return colorShades[Math.floor(Math.random() * colorShades.length)];
};
