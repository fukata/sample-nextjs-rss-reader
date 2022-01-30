const _pageTitle = "Sample RSS Reader";
export function pageTitle(title?: string) {
  if (title && title.length > 0) {
    return `${title} - ${_pageTitle}`;
  } else {
    return _pageTitle;
  }
}