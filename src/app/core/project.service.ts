import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects() {
    return this.http.get(`${environment.apiURL}/project`);
  }

  getProjectByID(project_id:any) {
    const formData = new FormData();
    formData.append('project_id', project_id);
    return this.http.post(`${environment.awsURL}/getprojectobjects`, formData);
  }
}
