import { Component } from '@angular/core';
import { NavBar } from "../../nav-bar/nav-bar";
import { Footer } from "../../footer/footer";
import { FixedIcon } from "../../fixedIcon/fixed-icon/fixed-icon";

@Component({
  selector: 'app-courses',
  imports: [NavBar, Footer, FixedIcon],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses {

}
