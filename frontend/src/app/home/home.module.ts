import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { HomeComponent } from "./home.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Home",
      urls: [{ title: "Home", url: "/home" }, { title: "Home" }],
    },
    component: HomeComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class HomeModule {}
