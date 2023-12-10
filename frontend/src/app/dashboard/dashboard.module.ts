import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
// import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardComponent } from "./dashboard.component";
import { FeedsComponent } from "./dashboard-components/feeds/feeds.component";
import { TopSellingComponent } from "./dashboard-components/top-selling/top-selling.component";
import { TopCardsComponent } from "./dashboard-components/top-cards/top-cards.component";
import { TopFiltersComponent } from "./dashboard-components/top-filters/top-filters.component";
import { AdminSharedModule } from "../admin-shared/admin-shared.module";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Dashboard",
      urls: [{ title: "Dashboard", url: "/dashboard" }, { title: "Dashboard" }]
    },
    component: DashboardComponent
  }
];

@NgModule({
  imports: [AdminSharedModule, FormsModule, ReactiveFormsModule, CommonModule, RouterModule.forChild(routes)],
  declarations: [DashboardComponent, FeedsComponent, TopSellingComponent, TopCardsComponent, TopFiltersComponent],
  exports: [DashboardComponent, FeedsComponent, TopSellingComponent, TopCardsComponent, TopFiltersComponent]
})
export class DashboardModule {}
