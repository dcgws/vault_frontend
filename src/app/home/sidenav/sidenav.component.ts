import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/core/models/project.model';
import { ProjectService } from 'src/app/core/project.service';
import { VaultStateService } from 'src/app/core/vault-state.service';
import { VaultService } from 'src/app/core/vault.service';

declare var $;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  selectedNav: string;
  selectedProject: string;
  folders = [];
  metadata = [];

  storageSize = 0;

  subscriptions: Subscription[] = [];
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private ProjectService: ProjectService,
    private VaultService: VaultService,
    private VaultStateService: VaultStateService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.ProjectService.getProjects().subscribe((response: any) => {
        const ids = [];
        response.projects.forEach((p) => {
          ids.push(p.project_id);
        });

        this.subscriptions.push(
          this.VaultService.getFiles().subscribe((response: any) => {
            this.metadata = response.results;
            this.folders = [];
            response.results.forEach((res) => {
              let folders = res.Key.split('/');

              if (folders[0] === 'projects') {
                folders = folders.filter((v) => v !== '' && v !== 'projects');

                if (folders.length > 0) {
                  if (this.folders.indexOf(folders[0]) === -1)
                    this.folders.push(folders[0]);
                }
              }
            });
          })
        );
      })
    );

    this.subscriptions.push(
      this.VaultStateService.newSelectedProject.subscribe((project) => {
        if (project) {
          this.selectedProject = project;
          this.selectedNav = project;
        }
      })
    );

    this.subscriptions.push(
      this.VaultService.getStorageUsed().subscribe((response: any) => {
        this.storageSize = parseFloat(response.results.split(' ')[0]) * 1000;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public getProjectName(node: string) {
    return this.metadata.find((m) => m.Key === 'projects/' + node + '/')
      .ProjectDetails;
  }

  public setSelectedProject(project: Project) {
    this.VaultStateService.updateSelectedProject(project);
    this.selectedNav = project.project_name;
  }

  sidenavOverlayClicked() {
    // this.StateService.sidenavStateUpdated(false);
  }

  navItemClicked(navItem) {
    if ($(navItem).attr('class').indexOf('subnavi-open') !== -1)
      this.renderer.removeClass(navItem, 'subnavi-open');
    else this.renderer.addClass(navItem, 'subnavi-open');
  }

  navigateTo(route: string) {
    this.selectedNav = route;
    this.router.navigateByUrl(`/agile/${route}`);
  }
}
