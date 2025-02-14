import { BasePlatform } from "./BasePlatform";

export class MacOSPlatform extends BasePlatform {
  protected paths = {
    sunshine: [`/Users/${process.env.USER}/.config/sunshine`],
    steam: ["~/Library/Application Support/Steam"],
  };
}
