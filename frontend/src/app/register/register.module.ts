import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { RegisterComponent } from "./register.component";

const routes: Routes = [
  {
    path: "register",
    data: {
      title: "Register",
      urls: [{ title: "Register", url: "/register" }, { title: "Register" }],
    },
    component: RegisterComponent,
  },
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
    RouterModule.forChild(routes),
    NgApexchartsModule,
  ],
})
export class RegisterModule {}
