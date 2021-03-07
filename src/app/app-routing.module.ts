import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IdentGuard } from "@bpUI/guards/ident.guard";
import { HomeComponent } from "app/components/home/home.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

const routes: Routes = [
  {
    path: "contractors",
    loadChildren:
      "./other-modules/contractors/contractors.module#ContractorsModule",
  },
  {
    path: "invoices",
    loadChildren: "./other-modules/invoices/invoices.module#InvoicesModule",
  },
  { path: "home", component: HomeComponent },
  { path: "not-found", component: NotFoundComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/not-found", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
