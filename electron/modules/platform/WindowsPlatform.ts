import { BasePlatform } from "./BasePlatform";

export class WindowsPlatform extends BasePlatform {
  protected paths = {
    sunshine: ["C:\\Program Files\\Sunshine", "C:\\Program Files (x86)\\Sunshine"],
    steam: ["C:\\Program Files (x86)\\Steam", "C:\\Program Files\\Steam"],
  };
}
