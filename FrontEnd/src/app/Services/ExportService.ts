import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './BaseService';
import { IExportService } from './Interface/IExportService';
import * as fileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExportService implements IExportService {

   baseURL = `http://localhost:9000/`;
   constructor(private http: HttpClient) {  }

    public exportPDFFile(){
        fileSaver.saveAs(`${this.baseURL}Export/DownloadPDF/1`, 'data.pdf');
    }

    public exportXLSFile(): void {
        fileSaver.saveAs(`${this.baseURL}Export/DownloadXLSX/1`, 'data.xlsx');
    }
}