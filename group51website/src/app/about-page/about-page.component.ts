import {
  Component,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  @ViewChild('FDGTab') FDGTab;
  @ViewChild('ArcTab') ArcTab;
  @ViewChild('MatrixTab') MatrixTab;
  @ViewChild('TreeTab') TreeTab;

  @ViewChild('TabTitle') Title;
  @ViewChild('TabSubtitle') Subtitle;
  @ViewChild('TabGif') Gif;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  openTab(tab: string) {

    this.renderer.setAttribute(this.FDGTab.nativeElement, 'class', '')
    this.renderer.setAttribute(this.ArcTab.nativeElement, 'class', '')
    this.renderer.setAttribute(this.MatrixTab.nativeElement, 'class', '')
    this.renderer.setAttribute(this.TreeTab.nativeElement, 'class', '')

    switch (tab) {
      case "FDG": {
        this.renderer.setAttribute(this.FDGTab.nativeElement, 'class', 'is-active')
        this.renderer.setProperty(this.Title.nativeElement, 'textContent', '3.1. Force Directed Graph')
        this.renderer.setProperty(this.Subtitle.nativeElement, 'textContent', 'This visualization is a node-link diagram that in which the nodes are employees and the edges are emails. The emails can also be grouped togheter to limit clutter and the size of a node represents its throughput of emails.')
        this.renderer.setProperty(this.Gif.nativeElement, 'src', './assets/GIFS/FDG.gif')
        this.renderer.setStyle(this.Gif.nativeElement, 'width', '100%')
        break
      }
      case "Arc": {
        this.renderer.setAttribute(this.ArcTab.nativeElement, 'class', 'is-active')
        this.renderer.setProperty(this.Title.nativeElement, 'textContent', '3.2. Arc Diagram')
        this.renderer.setProperty(this.Subtitle.nativeElement, 'textContent', 'This visualization provides an overview of the e-mail traffic between different job titles and the sentiment of the e-mails that are sent. In the diagram, each node represents a person and each arc represents one or more e-mail sent between people.')
        this.renderer.setProperty(this.Gif.nativeElement, 'src', './assets/GIFS/Arc.gif')
        this.renderer.setStyle(this.Gif.nativeElement, 'width', '88.1%')
        break
      }
      case "Matrix": {
        this.renderer.setAttribute(this.MatrixTab.nativeElement, 'class', 'is-active')
        this.renderer.setProperty(this.Title.nativeElement, 'textContent', '3.3. Adjacency Matrix')
        this.renderer.setProperty(this.Subtitle.nativeElement, 'textContent', 'This visualization is a matrix representation of the data. The rows and columns represent either the individual nodes, or the nodes groupedby job function.')
        this.renderer.setProperty(this.Gif.nativeElement, 'src', './assets/GIFS/Matrix.gif')
        this.renderer.setStyle(this.Gif.nativeElement, 'width', '47%')
        break
      }
      case "Tree": {
        this.renderer.setAttribute(this.TreeTab.nativeElement, 'class', 'is-active')
        this.renderer.setProperty(this.Title.nativeElement, 'textContent', '3.4. Tree Map')
        this.renderer.setProperty(this.Subtitle.nativeElement, 'textContent', 'In this tool, the treemap shows the number of emails every person in the range has sent, grouped by their job function. Each rectangle represents one employee.')
        this.renderer.setProperty(this.Gif.nativeElement, 'src', './assets/GIFS/TreeMap.gif')
        this.renderer.setStyle(this.Gif.nativeElement, 'width', '88.1%')
        break
      }
    }
  }
}
