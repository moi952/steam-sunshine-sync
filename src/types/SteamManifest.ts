interface Depot {
  manifest: string;
  size: string;
}

interface UserConfig {
  language: string;
}

interface MountedConfig {
  language: string;
}

export interface SteamManifest {
  appid: string;
  universe: string;
  LauncherPath: string;
  name: string;
  StateFlags: string;
  installdir: string;
  LastUpdated: string;
  LastPlayed: string;
  SizeOnDisk: string;
  StagingSize: string;
  buildid: string;
  LastOwner: string;
  UpdateResult: string;
  BytesToDownload: string;
  BytesDownloaded: string;
  BytesToStage: string;
  BytesStaged: string;
  TargetBuildID: string;
  AutoUpdateBehavior: string;
  AllowOtherDownloadsWhileRunning: string;
  ScheduledAutoUpdate: string;
  InstalledDepots: Record<string, Depot>;
  UserConfig: UserConfig;
  MountedConfig: MountedConfig;
}
