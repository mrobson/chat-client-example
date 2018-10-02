import {Component, OnDestroy, OnInit} from '@angular/core';
import {DemoService} from '../shared/demo.service';
import {Subscription} from 'rxjs';
import {Flow} from './emulate.model';

@Component({
  selector: 'app-emulate',
  templateUrl: './emulate.component.html',
  styleUrls: ['./emulate.component.css']
})
export class EmulateComponent implements OnInit, OnDestroy {
  subscription1 = new Subscription();
  public emulateResults = [];
  public flows: Flow[];
  private refresh = false;
  private interval;

  constructor(private demoService: DemoService) {
  }

  ngOnInit() {

    this.subscription1 = this.demoService.emulateResultChanged
      .subscribe(
        (result: Flow[]) => {
          this.flows = result;
          this.emulateResults.push(this.flows);
        }
      );

    this.demoService.emulate();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

  onRefresh() {
    this.refresh = !this.refresh;
    console.log(this.refresh);
    if (this.refresh) {
      this.interval = setInterval(() => {
        this.demoService.emulate();
      }, 1000);

    } else {
      clearInterval(this.interval);
    }


  }


}
