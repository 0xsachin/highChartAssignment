import { Component, signal } from '@angular/core';
import  {DemoOne}  from './demo-one/demo-one';
import  {DemoTwo}  from './demo-two/demo-two';
import  {DemoThree}  from './demo-three/demo-three';
import  {DemoFour}  from './demo-four/demo-four';
// import  {DemoFive}  from './demo-five/demo-five';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,DemoOne,DemoTwo,DemoThree,DemoFour],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // ✅ Corrected to plural
})
export class App {
  protected readonly title = signal('highChartAssignment');

  selectedExample = -1;
  selectExample(index:any) {
    // Logic to switch between different chart configurations
    console.log('Example selected');
    this.selectedExample = index;
  }
}
