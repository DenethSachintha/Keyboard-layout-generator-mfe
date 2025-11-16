import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { TypingStyle } from "../typing-style/typing-style";
import { Generate } from "../generate/generate";
import { Predict } from "../predict/predict";
import { Customize } from "../customize/customize";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-workflow',
  imports: [ImportsModule, TypingStyle, Generate, Predict, Customize, HttpClientModule],
  templateUrl: './workflow.html',
  styleUrl: './workflow.scss'
})
export class Workflow {
  

}
