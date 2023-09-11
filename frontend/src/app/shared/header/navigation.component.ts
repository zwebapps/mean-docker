import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, EventEmitter, Output, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/_services/auth.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";

declare var $: any;

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [NgbDropdownModule, CommonModule],
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent implements OnInit, AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() loggedInUser: any;
  unreadNotifications: any = [];

  public showSearch = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.storageService.getUser()) {
      this.getNotifications();
    }
  }
  ngAfterViewInit(): void {
    if (this.storageService.getUser()) {
      this.getNotifications();
    }
  }
  // This is for Notifications
  notifications: Object[] = [
    {
      btn: "btn-danger",
      icon: "ti-link",
      title: "Luanch Admin",
      subject: "Just see the my new admin!",
      time: "9:30 AM"
    },
    {
      btn: "btn-success",
      icon: "ti-calendar",
      title: "Event today",
      subject: "Just a reminder that you have event",
      time: "9:10 AM"
    },
    {
      btn: "btn-info",
      icon: "ti-settings",
      title: "Settings",
      subject: "You can customize this template as you want",
      time: "9:08 AM"
    },
    {
      btn: "btn-warning",
      icon: "ti-user",
      title: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM"
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: "assets/images/users/user1.jpg",
      status: "online",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:30 AM"
    },
    {
      useravatar: "assets/images/users/user2.jpg",
      status: "busy",
      from: "Sonu Nigam",
      subject: "I have sung a song! See you at",
      time: "9:10 AM"
    },
    {
      useravatar: "assets/images/users/user2.jpg",
      status: "away",
      from: "Arijit Sinh",
      subject: "I am a singer!",
      time: "9:08 AM"
    },
    {
      useravatar: "assets/images/users/user4.jpg",
      status: "offline",
      from: "Pavan kumar",
      subject: "Just see the my admin!",
      time: "9:00 AM"
    }
  ];

  public selectedLanguage: any = {
    language: "English",
    code: "en",
    type: "US",
    icon: "us"
  };

  public languages: any[] = [
    {
      language: "English",
      code: "en",
      type: "US",
      icon: "us"
    },
    {
      language: "Español",
      code: "es",
      icon: "es"
    },
    {
      language: "Français",
      code: "fr",
      icon: "fr"
    },
    {
      language: "German",
      code: "de",
      icon: "de"
    }
  ];

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.storageService.clean();

        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getNotifications = () => {
    this.userService.getAllContents().subscribe((notifications: any) => {
      console.log(notifications, ":::; notifications");
      if (notifications.length > 0) {
        this.unreadNotifications = notifications.filter((notify: any) => notify.status === "Pending");
      }
    });
  };
  redirectToNotifications() {
    this.router.navigate(["/admin/notifications"]);
  }
}
