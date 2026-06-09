const BASE_GRID = [
  "           xxxxxxxxxxxxxxxxxxxx         ",
  "         xxxxxxxxxxxxxxxxxxxxxxxx       ",
  "       xxxxxxxxxxxxxxxxxxxxxxxxxxx      ", // Morocco area
  "      xxxxxxxxxxxxxxxxxxxxxxxxxxxxx     ",
  "     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    ",
  "    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ", // Senegal area
  "    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ",
  "     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ",
  "       xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ",
  "         xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ", // Horn of Africa
  "             xxxxxxxxxxxxxxxxxxxxxxxxxx ",
  "              xxxxxxxxxxxxxxxxxxxxxxxxx ",
  "              xxxxxxxxxxxxxxxxxxxxxxx   ",
  "               xxxxxxxxxxxxxxxxxxxxx    ",
  "               xxxxxxxxxxxxxxxxxxxx     ",
  "               xxxxxxxxxxxxxxxxxxx      ",
  "                xxxxxxxxxxxxxxxx        ",
  "                xxxxxxxxxxxxxxx    xx   ", // Madagascar
  "                 xxxxxxxxxxxxx    xxxx  ",
  "                 xxxxxxxxxxxxx     xx   ",
  "                  xxxxxxxxxxx           ",
  "                  xxxxxxxxxx            ",
  "                   xxxxxxxx             ",
  "                   xxxxxxx              ",
  "                    xxxxx               ",
  "                     xxx                "
];
const grid = [];
for (let r = 0; r < BASE_GRID.length; r++) {
  let row1 = ""; let row2 = "";
  for (let c = 0; c < BASE_GRID[r].length; c++) {
    const char = BASE_GRID[r][c];
    row1 += char === 'x' ? 'xx' : '  ';
    row2 += char === 'x' ? 'xx' : '  ';
  }
  grid.push(row1); grid.push(row2);
}
for (let r = 0; r < grid.length; r++) {
  let line = "";
  for (let c = 0; c < grid[r].length; c++) {
    const isMorocco = (r >= 2 && r <= 5) && (c >= 18 && c <= 23);
    const isSenegal = (r >= 10 && r <= 13) && (c >= 6 && c <= 11);
    if (isMorocco) line += "M";
    else if (isSenegal) line += "S";
    else line += grid[r][c] === 'x' ? '.' : ' ';
  }
  console.log(r.toString().padStart(2, '0') + " " + line);
}
