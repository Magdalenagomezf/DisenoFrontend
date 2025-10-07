import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
open = false;
toggle() {
  this.open = !this.open;}
}
