export interface PrepCommand {
  do: string;
  undo: string;
  elevated: boolean;
}

export interface SunshineConfig {
  name: string;
  output: string;
  cmd: string;
  index: number;
  excludeGlobalPrepCmd: boolean;
  elevated: boolean;
  autoDetach: boolean;
  waitAll: boolean;
  exitTimeout: number;
  prepCmd: PrepCommand[];
  detached: string[];
  imagePath: string;
}
