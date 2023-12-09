import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardComponent } from "./dashboard.component";
import { SalesSummaryComponent } from "./dashboard-components/sales-summary/sales-summary.component";
import { FeedsComponent } from "./dashboard-components/feeds/feeds.component";
import { TopSellingComponent } from "./dashboard-components/top-selling/top-selling.component";
import { TopCardsComponent } from "./dashboard-components/top-cards/top-cards.component";
import { BlogCardsComponent } from "./dashboard-components/blog-cards/blog-cards.component";
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
  imports: [AdminSharedModule, FormsModule, ReactiveFormsModule, CommonModule, RouterModule.forChild(routes), NgApexchartsModule],
  declarations: [
    DashboardComponent,
    SalesSummaryComponent,
    FeedsComponent,
    TopSellingComponent,
    TopCardsComponent,
    // BlogCardsComponent,
    TopFiltersComponent
  ],
  exports: [
    DashboardComponent,
    SalesSummaryComponent,
    FeedsComponent,
    TopSellingComponent,
    TopCardsComponent,
    TopFiltersComponent
    // BlogCardsComponent
  ]
})
export class DashboardModule {}
