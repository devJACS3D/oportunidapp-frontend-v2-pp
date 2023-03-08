import { Component, OnInit } from "@angular/core";
import { ApiResponse } from "@apptypes/api-response";
import { ACTIONS } from "@apptypes/enums/actions.enum";
import { Entities } from "@services/entities";
import { ModalService } from "src/app/components/modal/modal.service";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
  DAYS_OF_WEEK
} from "angular-calendar";
import {
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  format
} from "date-fns";
import { Observable, Subject } from "rxjs";
import { delay, filter, map, tap } from "rxjs/operators";
import { SaveInterviewComponent } from "./save-interview/save-interview.component";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { LoggedUser } from "@apptypes/types";
import { UserAccountService } from "@services/user-account.service";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#EBCC68",
    secondary: "#EBCC68"
  },
  green: {
    primary: "#4cc708",
    secondary: "#4cc708"
  }
};
@Component({
  selector: "app-interviews",
  templateUrl: "./interviews.component.html",
  styleUrls: ["./interviews.component.scss"]
})
export class InterviewsComponent implements OnInit {
  header: string = "Calendario de entrevistas";
  view: string = "week";
  viewDate: Date = new Date();
  events$: Observable<Array<CalendarEvent<{ interview: any }>>>;
  events: Array<CalendarEvent<{ interview: any }>> = [];
  activeDayIsOpen: boolean = false;

  calendarEvents: CalendarEvent<{ interview: any }>[];
  locale: string = "es";

  private currentUser: LoggedUser;

  //Calendar variables
  excludeDays: number[] = []//[0, 6];
  weekStartsOn = DAYS_OF_WEEK.MONDAY;
  loadingCalendarEvents: boolean;
  refresh: Subject<any> = new Subject();
  constructor(
    private api: Api,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private userAccount: UserAccountService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userAccount.getUser();

    this.getEvents();
    this.handleScheduleUser();
  }

  private getTime(date: Date, hour: any): string {
    const timezoneOffset = date.getTimezoneOffset();
    const hoursOffset = String(
      Math.floor(Math.abs(timezoneOffset / 60))
    ).padStart(2, "0");
    const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, "0");
    const direction = timezoneOffset > 0 ? "-" : "+";
    return `T${hour.hour}:${hour.minutes}:${hour.secound}${direction}${hoursOffset}${minutesOffset}`;
  }

  private handleScheduleUser() {
    this.activatedRoute.queryParamMap
      .pipe(
        map(query => {
          return query.has("schedule")
            ? JSON.parse(query.get("schedule"))
            : null;
        }),
        filter(val => val !== null),
        delay(0)
      )
      .subscribe(res => this.scheduleUser(res));
  }

  private scheduleUser(data: { vid: number; uid: number }) {
    const date = moment().add(1, "hour");
    const modal = this.modalService.create(SaveInterviewComponent, {
      data: {
        date: date.format("YYYY-MM-DD"),
        time: date.format("HH:mm:ss"),
        userId: data.uid,
        vacancyId: data.vid,
        interviewerId: null,
        address: null,
        done: false,
        type: ACTIONS.SCHEDULE
      }
    });
    modal.afterDestroy$.subscribe(res => this.getEvents());
  }

  public getEvents(resetRequest?: boolean) {
    this.activeDayIsOpen = false;
    const startDate = format(
      startOfWeek(this.viewDate, { weekStartsOn: 1 }),
      "YYYY-MM-DD"
    );
    const endDate = format(
      endOfWeek(this.viewDate, { weekStartsOn: -1 }),
      "YYYY-MM-DD"
    );

    let strEntity =
      this.currentUser.userTypeId == 1
        ? Entities.interviews
        : Entities.psychologistsInterviews;
    this.api
      .get(strEntity, null, 1, 100, { startDate, endDate }, resetRequest)
      .pipe(
        map((apiResp: ApiResponse) => apiResp.response.data),
        map((interviews: any[]) => {
          return interviews.map((interview: any,index) => {
            const date = new Date(`2021-07-${6+index}`);
            date.setHours(8);
            return this.mapEvent(interview,date)
          });
        })
      )
      .subscribe(events => {
        this.events = events;
        this.refresh.next();
      });
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ film: any }>>;
  }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  async eventClicked(event: CalendarEvent<{ interview: any }>): Promise<void> {
    const date = moment(event.start).format("YYYY-MM-DD");
    const interviewTime = event.meta.interview.hour;
    const time = Utilities.timeToString({
      hour: interviewTime.hour,
      second: interviewTime.secound || 0,
      minute: interviewTime.minutes || 0
    });

    const modal = this.modalService.create(SaveInterviewComponent, {
      data: {
        date,
        time,
        id: event.meta.interview.id,
        userId: event.meta.interview.userId,
        vacancyId: event.meta.interview.vacancyId,
        interviewerId: event.meta.interview.interviewerId,
        address: event.meta.interview.address,
        done: event.meta.interview.done,
        type: ACTIONS.DETAIL
      }
    });

    modal.afterDestroy$.subscribe(res => {
      this.getEvents();
    });
  }

  public hourSegmentClicked(event: any) {
    const momentDate = moment(event.date);
    const diffTime = moment().diff(momentDate, "minutes") * Math.sign(-1);
    if (diffTime > 59) {
      const time = momentDate.format("HH:mm:ss");
      const date = momentDate.format("YYYY-MM-DD");
      const modal = this.modalService.create(SaveInterviewComponent, {
        data: {
          date,
          time,
          userId: null,
          vacancyId: null,
          interviewerId: null,
          address: null,
          done: false,
          type: ACTIONS.CREATE
        }
      });

      modal.afterDestroy$.subscribe(res => this.getEvents());
    }
  }

  /* ................................................................................................. */
  /* Calendar array methods */
  /* ................................................................................................. */
  removeCalendarEvent(interviewId: number) {
    this.calendarEvents = this.calendarEvents.filter(
      c => c.meta.interview.id !== interviewId
    );
  }
  findAndDone(data) {
    const found = this.calendarEvents.find(
      c => c.meta.interview.id === data.id
    );
    if (!found) return;

    found.color = colors.green;
    found.meta.interview = data;
  }
  /* ................................................................................................. */
  /* MAP EVENTS */
  /* ................................................................................................. */
  mapEvent(interview: any,asd: any): CalendarEvent {
    let event: CalendarEvent;
    interview.hour["secound"] = interview.hour.secound
      ? interview.hour.secound
      : 0;
    interview.hour["minutes"] = interview.hour.minutes
      ? interview.hour.minutes
      : 0;

    const date = new Date(interview.date);
    date.setDate(date.getDate()+1);
    date.setHours(parseInt(interview.hour.hour));
    date.setMinutes(parseInt(interview.hour.minutes));
    date.setSeconds(parseInt(interview.hour.secound));


    event = {
      title: `Entravista con ${interview.user.firstName} ${interview.user.lastName}`,
      start: date,
      color: interview.done ? colors.green : colors.yellow,
      cssClass: "calendar-fw",
      meta: {
        interview
      }
    };
    //interview.date + this.getTime(this.viewDate, interview.hour)
    return event;
  }

  /* ................................................................................................. */
  /* SWR CALENDAR CYCLES */
  /* ................................................................................................. */
  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.header.forEach(h => {
      h.cssClass = "cal-day-headers-c-item";
    });
    renderEvent.hourColumns.forEach(h =>
      h.hours.forEach(f =>
        f.segments.forEach(s => (s.cssClass = "cal-day-c-item"))
      )
    );
  }
  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    renderEvent.body.hourGrid.forEach(hg =>
      hg.segments.forEach(s => (s.cssClass = "cal-day-c-item"))
    );
  }
  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent) {
    renderEvent.header.forEach(h => {
      h.cssClass = "cal-day-headers-c-item";
    });
    renderEvent.body.forEach(b => (b.cssClass = "cal-day-c-item"));
  }
}
