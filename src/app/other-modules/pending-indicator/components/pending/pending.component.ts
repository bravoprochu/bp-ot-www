import { Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pending",
  templateUrl: "./pending.component.html",
  styleUrls: ["./pending.component.css"],
})
export class PendingComponent implements OnInit {
  @Input() isPending = false;

  constructor() {}

  ngOnInit() {}
}
