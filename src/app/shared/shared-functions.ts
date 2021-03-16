export function canOpenOverleaf(filename: string): RegExpMatchArray | null {
  const regex = /\w+\.tex/g;
  return filename.match(regex);
}
