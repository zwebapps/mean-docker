import { Component, AfterViewInit, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, EventEmitter, Output } from "@angular/core";
import { ROUTES } from "./menu-items";
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule, NgIf } from "@angular/common";
import { StorageService } from "src/app/_services/storage.service";
//declare var $: any;

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterModule, CommonModule, NgIf],
  templateUrl: "./sidebar.component.html"
})
export class SidebarComponent implements OnInit, OnChanges, AfterViewInit {
  showMenu = "";
  showSubMenu = "";
  @Input() userRole: string = "ROLE_USER";
  @Output() toggleSideMenue = new EventEmitter<string>();
  @Input({ required: false }) selectedCompetition: any = {};
  public sidebarnavItems: RouteInfo[] = [];
  public displayCoachMenu: boolean = false;

  // this is for the open close

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private storageService: StorageService) {}

  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
    this.sidebarnavItems = this.sidebarnavItems.map((sidebarnavItem) => {
      sidebarnavItem.title === element ? (sidebarnavItem.class = "active") : (sidebarnavItem.class = "");
      return {
        ...sidebarnavItem,
        class: sidebarnavItem.class
      };
    });
    this.toggleSideMenue.emit();
  }
  ngAfterViewInit() {
    if (this.storageService.getCompetition()) {
      this.displayCoachMenu = true;
    }
  }
  ngOnChanges() {
    if (this.storageService.getUser()) {
      // getting the roles
      this.userRole = this.storageService.getUser().roles[0];
    }
    if (this.storageService.getCompetition()) {
      this.displayCoachMenu = true;
    }
  }
  // End open close
  ngOnInit() {
    // get the query the params
    const user = this.storageService.getUser();
    if (user) {
      let userRoutes: any = ROUTES.find((item) => item["role"] === this.userRole);
      if (this.userRole !== "ROLE_SUPERADMIN") {
        this.sidebarnavItems = userRoutes["routes"].map((route: any) => {
          return {
            ...route,
            path: `/${user.shortcode}${route.path}`
          };
        });
      } else {
        this.sidebarnavItems = userRoutes["routes"];
      }
      this.sidebarnavItems = this.sidebarnavItems.map((item: any) => {
        return {
          ...item,
          class: this.router.url.includes(item.path) ? (item.class = "active") : (item.class = "")
        };
      });
    }
  }
}
