import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "app/components/home/home.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

const routes: Routes = [
  {
    path: "contractors",
    loadChildren: () =>
      import("./other-modules/contractors/contractors.module").then(
        (m) => m.ContractorsModule
      ),
  },
  {
    path: "invoices",
    loadChildren: () =>
      import("./other-modules/invoices/invoices.module").then(
        (m) => m.InvoicesModule
      ),
  },
  {
    path: "transport",
    loadChildren: () =>
      import("./other-modules/transport/transport.module").then(
        (m) => m.TransportModule
      ),
  },
  {
    path: "user-management",
    loadChildren: () =>
      import("./other-modules/user-management/user-management.module").then(
        (m) => m.UserManagementModule
      ),
  },
  { path: "home", component: HomeComponent },
  { path: "not-found", component: NotFoundComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/not-found", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
