import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SchedulerExportService {
  excelFileType = 'application/vnd.openxmlformats-officedocumnet.spreadsheet.sheet;charset=UTF-8';

  constructor() { }

  public exportCSV(jsonData: any[], filename: string): void {
    const header = Object.keys(jsonData[0]);
    let csv = jsonData.map((row) => 
      header
        .map((fieldName) => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value))
        .join(',')
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    this.saveCSVFile(csvArray, filename); 
  }

  private saveCSVFile(csvArray: any, filename: string) {
    const data: Blob = new Blob([csvArray], { type: 'text/csv' });
    FileSaver.saveAs(data, filename + '.csv');
  }

  public exportExcel(jsonData: any[], filename: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'schedule': ws }, SheetNames: ['schedule']};
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, filename);
  }

  private saveExcelFile(buffer: any, filename: string): void {
    const data: Blob = new Blob([buffer], { type: this.excelFileType });
    FileSaver.saveAs(data, filename + '.xlsx');
  }
}
