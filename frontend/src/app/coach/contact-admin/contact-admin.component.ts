import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NotifierService } from "angular-notifier";
import { PlayerService } from "src/app/_services/player.service";
import { StorageService } from "src/app/_services/storage.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-contact-admin",
  templateUrl: "./contact-admin.component.html",
  styleUrls: ["./contact-admin.component.scss"]
})
export class ContactAdminComponent implements OnInit {
  notifier: NotifierService;
  public htmlContent: any = "Any content here";
  form: FormGroup;
  user: any;
  contents: any;

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
      status: ["Pending"],
      user: ["", Validators.required]
    });
  }
  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.user) {
      this.getAllContents(this.user?.id);
    }
  }
  uploadFiles(event: any) {
    const file: File = event.target.files[0];
    this.palyerService.upload(file).subscribe((res: any) => {
      this.notifier.notify("success", `${res.message}`);
    });
  }
  onChange(event: any) {
    // console.log('changed', event);
    // console.log(this.form.value.content)
  }

  onBlur(event: any) {
    // console.log('blur ' + event);
    // console.log(this.form.value.content)
    this.form.patchValue({
      user: this.user
    });
  }

  submitContents = () => {
    console.log(this.form.value.content);
    this.form.patchValue({
      user: this.user,
      status: "Pending"
    });
    if (this.form.valid) {
      this.userService.createContact(this.form.value).subscribe((res: any) => {
        if (res) {
          this.notifier.notify("success", `Message sent successfully!`);
          this.form.reset();
          this.user = this.storageService.getUser();
          if (this.user) {
            this.getAllContents(this.user?.id);
          }
        }
      });
    }
  };
  getAllContents = (id: any) => {
    if (id) {
      this.userService.getAllContentsByCoach(id).subscribe((res: any) => {
        if (res) {
          this.contents = res.conent;
          // this.notifier.notify('success', `${res.message}`);
        }
      });
    }
  };
  deleteContent = (id: any) => {
    this.userService.deleteContent(id).subscribe((res: any) => {
      if (res) {
        this.notifier.notify("success", "Message deleted successfully!");
        this.user = this.storageService.getUser();
        if (this.user) {
          this.getAllContents(this.user?.id);
        }
      }
    });
  };
  redirectTo() {
    this.router.navigate(["/coach/dashboard"]);
  }
}
