import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  constructor(private http: HttpClient) {}

  getFolders(ids: Array<string>) {
    const formData = new FormData();
    // formData.append('id', ids[ids.length - 1]);
    // formData.append('project_name', project_name);
    ids.forEach((id) => {
      formData.append('id[]', id);
    });

    return this.http.post(`${environment.awsURL}/getproject`, formData);
  }

  uploadFile(file: File, path: string) {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('file', file);
    return this.http.post(`${environment.awsURL}/upload`, formData);
  }

  uploadFolder(folderName: string, path: string) {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('folder_name', folderName);
    return this.http.post(`${environment.awsURL}/createfolder`, formData);
  }
}