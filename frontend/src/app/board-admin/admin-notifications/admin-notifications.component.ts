import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NotifierService } from "angular-notifier";
import { PlayerService } from "src/app/_services/player.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-admin-notifications",
  templateUrl: "./admin-notifications.component.html",
  styleUrls: ["./admin-notifications.component.scss"]
})
export class AdminNotificationsComponent implements OnInit {
  notifier: NotifierService;
  public htmlContent: any = "";
  form: FormGroup;
  user: any;
  contents: any;
  notificationForm: boolean = false;
  notification: any = {};

  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "25rem",
    width: "75%",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };

  constructor(
    private router: Router,
    private palyerService: PlayerService,
    notifier: NotifierService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private userService: UserService
  ) {
    this.notifier = notifier;
    this.form = this.formBuilder.group({
      heading: ["", Validators.required],
      content: ["", Validators.required],
      status: ["", Validators.required],
      reply: ["", Validators.required],
      user: [""]
    });
  }
  ngOnInit(): void {
    this.getAllContents();
  }
  submitContents = () => {
    console.log(this.form.value.content);
    if (this.form.valid) {
      this.userService.updateContent(this.notification._id, this.form.value).subscribe((res: any) => {
        if (res) {
          this.notifier.notify("success", `${res.message}`);
          this.getAllContents();
        }
      });
    } else {
      this.notifier.notify("error", "Please fill all fields!");
    }
  };

  onChange(event: any) {
    // console.log('changed', event);
    // console.log(this.form.value.content)
  }

  onBlur(event: any) {
    // console.log('blur ' + event);
    // console.log(this.form.value.content)
    // this.form.patchValue({
    //   user: this.user
    // })
  }
  editNotification = (notification: any) => {
    if (notification) {
      this.notificationForm = true;
      this.notification = notification;
      this.htmlContent = notification.content;
      this.form.patchValue({
        heading: notification.heading,
        content: notification.content,
        reply: notification.reply,
        user: notification.user
      });
    }
  };
  getAllContents = () => {
    this.userService.getAllContents().subscribe((res: any) => {
      if (!res.message) {
        this.contents = res;
      }
    });
  };
  deleteContent = (id: any) => {
    this.userService.deleteContent(id).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", "Content deleted successfully!");
      }
    });
  };
  redirectTo() {
    this.router.navigate(["/coach/dashboard"]);
  }
}
