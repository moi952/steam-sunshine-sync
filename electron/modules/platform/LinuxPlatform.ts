import { execSync } from "child_process";
import { BasePlatform } from "./BasePlatform";

export class LinuxPlatform extends BasePlatform {
  protected paths = {
    sunshine: [
      "/usr/bin/sunshine",
      "/opt/sunshine",
      "/usr/bin",
      "/usr/local/bin",
      `${process.env.HOME}/.local/bin`,
    ],
    steam: [
      "~/.steam/steam",
      "~/.local/share/Steam",
      `${process.env.HOME}/.steam/steam`,
      "/usr/lib/steam",
      "/usr/local/games/steam",
    ],
  };

  private distro: string;

  constructor() {
    super();
    this.distro = LinuxPlatform.detectDistro();
    this.definePaths();
  }

  private static detectDistro(): string {
    try {
      return execSync('cat /etc/os-release || echo "Unknown"').toString().toLowerCase();
    } catch {
      return "unknown";
    }
  }

  definePaths() {
    if (this.distro.includes("steamos")) {
      this.paths = {
        sunshine: ["/usr/bin/sunshine", "/opt/sunshine"],
        steam: ["/home/deck/.steam/steam", "/home/deck/.local/share/Steam"],
      };
    }
  }
}
