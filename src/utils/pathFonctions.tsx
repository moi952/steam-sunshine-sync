export const normalizePath = async (path: string): Promise<string> =>
  window.electron.normalizePath(path);

export const normalizeLocalPath = async (path: string): Promise<string> => {
  const normalized = await normalizePath(path);
  return `local://${encodeURI(normalized.replace(/\\/g, "/"))}`;
};
