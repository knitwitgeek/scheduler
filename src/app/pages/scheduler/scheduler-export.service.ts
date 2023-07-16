import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SchedulerExportService {
  fileType = 'application/vnd.openxmlformats-officedocumnet.spreadsheet.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  constructor() { }

  public exportExcel(jsonData: any[], filename: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'schedule': ws }, SheetNames: ['schedule']};
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, filename);
  }

  private saveExcelFile(buffer: any, filename: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, filename + this.fileExtension);
  }
}
