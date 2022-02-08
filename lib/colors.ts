const colors: string[] = [
  '#696969',
  '#4169e1',
  '#0000cd',
  '#008080',
  '#006400',
  '#008000',
  '#556b2f',
  '#b22222',
  '#c71585',
  '#9400d3',
  '#6a5acd',
];

export function pickColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

function parseHexColorCodeToInt(colorCode: string): [number, number, number] {
  colorCode = colorCode.length === 7 ? colorCode.slice(1, 6) : colorCode;
  return [
    parseInt(colorCode.slice(0, 2), 16),
    parseInt(colorCode.slice(2, 4), 16),
    parseInt(colorCode.slice(4, 6), 16),
  ];
}

// see https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
export function textColorCodeFromBgColor(bgColor: string) {
  const colorNumbers = parseHexColorCodeToInt(bgColor);
  const luminance = (0.299 * colorNumbers[0] + 0.587 * colorNumbers[1] + 0.114 * colorNumbers[2]) / 255;
  if (luminance > 0.5) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}