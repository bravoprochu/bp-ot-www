import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRolesEnum } from "@bpShared/enums/user-roles.enum";
import { IdentGuard } from "app/ui/guards/ident.guard";
import { TransportListComponent } from "./components/transport-list/transport-list.component";
import { TransportComponent } from "./components/transport/transport.component";

const routes: Routes = [
  {
    path: "lista",
    component: TransportListComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Spedytor,
      name: "Transport",
      description: "Rejestr zakupionych transportów i ich statusy",
    },
  },
  {
    path: "transport/:id",
    component: TransportComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Spedytor },
  },

  { path: "", redirectTo: "lista", pathMatch: "full" },
  { path: "**", redirectTo: "lista" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportRoutingModule {}
