/**
 * Service for Export and Import CSV, Xlsx file
 */

'use strict';
let XLSX = require('xlsx');

function datenum(v, date1904) {
  if (date1904) v += 1462;
  let epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data) {
  let ws = {};
  let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };

  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;

      let cell = { v: data[R][C] };
      if (cell.v === null) continue;

      let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';
      ws[cell_ref] = cell;
    }
  }

  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

module.exports = {
  /**
   * Export data and Write to Xlsx file
   * @param {array}  data - the data you want to export
   *      [
   *        ['head cell', 'head cell', 'head cell'],
   *        ['data', 'data', 'data']
   *      ]
   * @param {string} filePath - path of folder can write this export file
   *      e.g './.tmp/xlsx/log-22-08-2017.xlsx'
   *      please make sure the directory './.tmp/xlsx' is available
   * @return null
   */
  write: function(data, filePath) {
    const ws_name = 'Export data';

    function Workbook() {
      if (!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
    }

    let wb = new Workbook(),
      ws = sheet_from_array_of_arrays(data);

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    /* write file */
    XLSX.writeFile(wb, filePath);
  }
};
