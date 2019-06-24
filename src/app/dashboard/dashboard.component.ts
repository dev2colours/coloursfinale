import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { ParticipantData } from 'app/models/enterprise-model';
import { ActionItem } from 'app/models/task-model';
import * as moment from 'moment';
import { Project, workItem } from 'app/models/project-model';
import { coloursUser } from 'app/models/user-model';
import { ProjectService } from 'app/services/project.service';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrls: ['./dashboard.component.css']

})
export class DashboardComponent implements OnInit {
  public gradientStroke;
  public chartColor;
  public canvas : any;
  public ctx;
  public gradientFill;
  // constructor(private navbarTitleService: NavbarTitleService) { }
  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;

  public activeUsersChartType;
  public activeUsersChartData:Array<any>;
  public activeUsersChartOptions:any;
  public activeUsersChartLabels:Array<any>;
  public activeUsersChartColors:Array<any>
  allMyProjects: any;
  allColoursProjects: any;
  userId: any;
  user: any;
  myData: ParticipantData;
  viewActions: Observable<workItem[]>;
  // myActionItems: ActionItem[];
  myActionItems: any;
  actionNo: number;

  public showActions: boolean = false;
  public hideActions: boolean = false;

  public showProjs: boolean = false;
  public hideProjs: boolean = false;

  public showMdata: boolean = false;
  public hideMdata: boolean = false;


  userProfile: Observable<coloursUser>;
  myDocument: AngularFirestoreDocument<{}>;
  userData: coloursUser;
  cdTimer: string;
  projsNo: any;
  myProjects: any;
  thyProjects: any;
  marketProjects: any;
  projs2No: number;
  viewProjects: any;
  maActivities: any;

  constructor(public afAuth: AngularFireAuth, public router: Router, private authService: AuthService, private afs: AngularFirestore, private ps: ProjectService) {
    // this.afAuth.user.subscribe(user => {
    //   this.userId = user.uid;
    //   this.user = user;
    //   this.dataCall();
    // });
    this.afAuth.authState.subscribe(user => {
      if (user === null) {
        this.router.navigate(['/pages/login']);
      } else {
        this.userId = user.uid;
        this.user = user;
        this.dataCall();
      }
    })
    // this.countDown(10, "status");
    // this.countDownPopup(10);
  }

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  // countDown(secs, elem) {
  //   var element = document.getElementById(elem);
  //   element.innerHTML = "Please wait for " + secs + " seconds";
  //   if (secs < 1) {
  //     clearTimeout(timer);
  //     element.innerHTML = '<h2>Countdown Complete!</h2>';
  //     element.innerHTML += '<a href="#">Click here now</a>';
  //   }
  //   secs--;
  //   var timer = setTimeout('countDown(' + secs + ',"' + elem + '")', 1000);
  // }

  // countDownPopup(secs) {
  //   var element = "Please wait for " + secs + " seconds";
  //   if (secs < 1) {
  //     clearTimeout(timer);
  //     element = 'Countdown Complete!';
  //   }
  //   this.cdTimer = element;
  //   console.log(this.cdTimer);
    
  //   secs--;
  //   var timer = setTimeout('countDownPopup(' + secs + ')', 1000);
  //   console.log(timer);
    
  // }

  dataCall(){
    this.myDocument = this.afs.collection('Users').doc(this.user.uid);

    this.userProfile = this.myDocument.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as coloursUser;
      const id = a.payload.id;
      return { id, ...data };
    }));

    this.userProfile.subscribe(userData => {
      console.log(userData);
      let myData = {
        name: this.user.displayName,
        email: this.user.email,
        bus_email: userData.bus_email,
        id: this.user.uid,
        phoneNumber: this.user.phoneNumber,
        photoURL: this.user.photoURL,
        address: userData.address,
        nationality: userData.nationality,
        nationalId: userData.nationalId
      }

      if (userData.address == "" || userData.address == null || userData.address == undefined) {
        userData.address = ""
      } else {

      }

      if (userData.phoneNumber == "" || userData.phoneNumber == null || userData.phoneNumber == undefined) {
        userData.phoneNumber = ""
      } else {

      }

      if (userData.bus_email == "" || userData.bus_email == null || userData.bus_email == undefined) {
        userData.bus_email = ""
      } else {

      }

      if (userData.nationalId == "" || userData.nationalId == null || userData.nationalId == undefined) {
        userData.nationalId = ""
      } else {

      }

      if (userData.nationality == "" || userData.nationality == null || userData.nationality == undefined) {
        userData.nationality = ""
      } else {

      }

      this.myData = myData;
      this.userData = userData;

    });


    console.log("Yeeeeeeeees");
    

    // this.showActions = false;
    // this.hideActions = false;

    // this.showProjs = false;
    // this.hideProjs = false;

    let currentDate = moment(new Date()).format('L');;
    let today = moment(new Date(), "YYYY-MM-DD");

    console.log(currentDate);


    let userDocRef = this.afs.collection('Users').doc(this.userId);
    this.viewActions = userDocRef.collection<workItem>('WeeklyActions', ref => ref
      // .limit(4)
      // .where("startDate", '==', currentDate)
      .orderBy('start', 'asc')
      
      // .limit(4)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as workItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

    this.viewActions.subscribe((actions) => {
      console.log(actions);
      
      this.myActionItems = [];

      actions.forEach(element => {
        if (element.selectedWeekWork == true) {
          if (moment(element.startDate).isSameOrAfter(today) || element.complete == false) {
            if (element.selectedWork === true) {

              this.myActionItems.push(element);

            }
          }
        }
      });


      let maActivities;
      maActivities = [];

      let arrT = this.myActionItems;
      let timeB4;
      let timeA4;
      timeB4 = moment().subtract(2, 'h').format('HH:mm');
      timeA4 = moment().add(2, 'h').format('HH:mm');

      console.log('timeB4' + timeB4);
      console.log('timeA4' + timeA4);

      

      this.myActionItems.forEach((function (element, index) {
        console.log(index);
        console.log(element);
        
        if (moment(element.start).isBetween(timeB4, timeA4)) {
          // element.txtColours = "white";
          element.txtColours = "red";
          // element.txtColours = "333366";
          maActivities.push(element);
        }
        else {
          // element.txtColours = "yellow";
          element.txtColours = "333366";
          maActivities.push(element);
        }

      }));
      
      this.maActivities = maActivities;

      console.log(actions.length);
      console.log(actions);
      this.actionNo = actions.length;
      if (this.actionNo == 0) {

        this.showActions = false;
        this.hideActions = true;
      } else {
        this.hideActions = false;
        this.showActions = true;
      }
    })
    let myProjects = userDocRef.collection('projects', ref => ref.orderBy('createdOn', "desc").limit(5)).valueChanges();

    this.thyProjects = 0;
    myProjects.subscribe((projects) => {
      console.log(projects);
      console.log(this.allMyProjects);

      this.thyProjects = projects;

      this.projsNo = projects.length;
      if (this.projsNo == 0) {

        this.showProjs = false;
        this.hideProjs = true;

      } else {


        this.showProjs = true;
        this.hideProjs = false;
      }
    });

    this.myProjects = myProjects;

    // this.allMyProjects = userDocRef.collection('projects', ref => ref.orderBy('createdOn', "desc").limit(4)).valueChanges();
    this.allMyProjects = this.ps.getProjects(this.userId);
    this.projsNo = 0;
    this.allMyProjects.subscribe((projects) => {
      console.log(projects);
      console.log(this.allMyProjects);
      this.viewProjects = projects;
      this.projsNo = projects.length;
      if (this.projsNo == 0) {

        this.showProjs = false;
        this.hideProjs = true;

      } else {


        this.showProjs = true;
        this.hideProjs = false;
      }
    })
  }

  // [ngClass]=" {whiteColor: isStyleRequired(log)}"
  
  public ngOnInit() {

    this.chartColor = "#FFFFFF";

    var cardStatsMiniLineColor = "#fff",
      cardStatsMiniDotColor = "#fff";

    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          //Get ctx from string
          var ctx = chart.chart.ctx;

          //Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'Arial';
          var txt = centerConfig.text;
          var color = centerConfig.color || '#000';
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          //Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = (chart.innerRadius * 2);

          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight);

          //Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          //Draw text in center
          ctx.fillText(txt, centerX, centerY);
        }
      }
    });

    this.canvas = document.getElementById("activeUsers");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [{
          label: "Active Users",
          borderColor: "#6bd098",
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          borderWidth: 3,
          data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610]
        }]
      },
      options: {

        legend: {

          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });


    this.canvas = document.getElementById("emailsCampaignChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#18ce0f');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));

    var myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ["12pm", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"],
        datasets: [{
          label: "Email Stats",
          borderColor: "#ef8156",
          pointHoverRadius: 0,
          pointRadius: 0,
          fill: false,
          backgroundColor: this.gradientFill,
          borderWidth: 3,
          data: [40, 500, 650, 700, 1200, 1250, 1300, 1900]
        }]
      },
      options: {

        legend: {

          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });

    this.canvas = document.getElementById("activeCountries");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#2CA8FF');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#2CA8FF', 0.4));

    var a = {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
        datasets: [{
          label: "Active Countries",
          backgroundColor: this.gradientFill,
          borderColor: "#fbc658",
          pointHoverRadius: 0,
          pointRadius: 0,
          fill: false,
          borderWidth: 3,
          data: [80, 78, 86, 96, 83, 85, 76, 75, 88, 90]
        }]
      },
      options: {

        legend: {

          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    };

    var viewsChart = new Chart(this.ctx, a);

    this.allColoursProjects = this.afs.collection('Projects', ref => ref.orderBy('createdOn', "desc").limit(10)).valueChanges();
    this.projs2No = 0;

    this.marketProjects = [];
    this.allColoursProjects.subscribe((projects) => {
      console.log(projects);

      this.projs2No = projects.length;
      if (this.projs2No == 0) {

        this.showMdata = false;
        this.hideMdata = true;

      } else {

        this.showMdata = true;
        this.hideMdata = false;

      }
      let marketProjects;
      marketProjects = [];

      projects.forEach(function (element, index) {
        // console.log(index);
        // console.log(element);
        let  proj = projects[index];

        if (index % 2 === 0) {
          proj.txtColours = "white";
          marketProjects.push(proj);
        } else {
          // projects[index].txtColours = "#333366";
          proj.txtColours = "#333366";
          marketProjects.push(proj);
        }

      });
      // this.marketProjects = projects;
      this.marketProjects = marketProjects;
      
    });


    console.log(this.marketProjects);
    
    // const lists = document.getElementsByClassName('setLists')[0];
    // if (window.matchMedia(`(height: 100px)`).matches) {
    //   lists.classList.add('perfect-scrollbar-on');
    // }
    // else {
    //   lists.classList.add('perfect-scrollbar-off');
    // }
  } 

  getTextColor(i: number): String {
    return i % 2 === 0 ? 'blue' : '';
  }
}
