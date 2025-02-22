export interface PrepCommand {
  do: string;
  undo: string;
  elevated: boolean;
}

export interface SunshineAppConfig {
  name: string;
  output?: string;
  cmd?: string;
  index?: number;
  "exclude-global-prep-cmd"?: boolean;
  elevated?: boolean;
  "auto-detach"?: boolean;
  "working-dir"?: string;
  "wait-all"?: boolean;
  "exit-timeout"?: number;
  "prep-cmd"?: PrepCommand[];
  detached?: string[];
  "image-path"?: string;
}
