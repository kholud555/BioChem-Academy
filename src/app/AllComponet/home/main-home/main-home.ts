import { Component } from '@angular/core';
import { NavBar } from "../../nav-bar/nav-bar";
import { Header } from "../header/header";
import { Footer } from "../../footer/footer";
import { FixedIcon } from "../../fixedIcon/fixed-icon/fixed-icon";
import { Slider } from "../../slider/slider";
import { WhyChosseUs } from "../../why-chosse-us/why-chosse-us";
import { ShowService } from "../../show-service/show-service";
import { Free } from "../../free/free";
import { VideoForTeacher } from "../../video-for-teacher/video-for-teacher";

@Component({
  selector: 'app-main-home',
  imports: [NavBar, Header, Footer, FixedIcon, Slider, WhyChosseUs, ShowService, Free, VideoForTeacher],
  templateUrl: './main-home.html',
  styleUrl: './main-home.css'
})
export class MainHome {

}
