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