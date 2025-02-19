import { SunshineAppConfigNew } from "../types";

export function initEmptySunshineApp(
  appSunshine: Partial<SunshineAppConfigNew>,
): SunshineAppConfigNew {
  return {
    name: appSunshine.name ?? "",
    output: appSunshine.output ?? "",
    cmd: appSunshine.cmd ?? undefined,
    index: appSunshine.index ?? undefined,
    "exclude-global-prep-cmd": appSunshine["exclude-global-prep-cmd"] ?? undefined,
    elevated: appSunshine.elevated ?? undefined,
    "auto-detach": appSunshine["auto-detach"] ?? undefined,
    "working-dir": appSunshine["working-dir"] ?? "",
    "wait-all": appSunshine["wait-all"] ?? undefined,
    "exit-timeout": appSunshine["exit-timeout"] ?? 0,
    "prep-cmd": appSunshine["prep-cmd"] ?? [],
    detached: appSunshine.detached ?? [],
    "image-path": appSunshine["image-path"] ?? "",
  };
}
