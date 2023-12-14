import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { ProfileComponent } from "./profile.component";

const routes: Routes = [
  {
    path: "profile",
    data: {
      title: "Profile",
      urls: [{ title: "Profile", url: "/profile" }, { title: "Profile" }]
    },
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes)
    // NgApexchartsModule,
  ]
})
export class ProfileModule {}
