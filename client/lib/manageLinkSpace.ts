export const manageLinkSpace = (l: string | URLSearchParams) => {
  return l.toString().replace(/\+/g, "%20");
};
