import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public currentValue: number = 0;
  public generator: AsyncGenerator<number> | null = null;
  public generatorPaused: boolean = false;
  public error: Error | null = null;

  async ngOnInit() {
    this.generator = this.generateSequence(1, 100);

    while (true) {
      if (!this.generator) {
        break; // complete the cycle, if we don't have generator
      }

      try {
        const { value, done } = await this.generator.next();
        if (done) {
          break; // complete the cycle, if data is ended
        }

        if (this.generatorPaused) {
          // generator is stopped
          while (this.generatorPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        this.currentValue = value;
      } catch (error) {
        this.error = error as any;
        this.generator = null; // stop generator after error
      }
    }
  }

  async *generateSequence(start: number, end: number): AsyncGenerator<number> {
    for (let i = start; i <= end; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield i;
      } catch (error) {
        throw error; // Redirecting error to await this.generator.next()
      }
    }
  }

  toggleGeneratorPause() {
    this.generatorPaused = !this.generatorPaused;
  }

  throwGeneratorError() {
    if (this.generator) {
      this.generator.throw(new Error('Sample error generated.'));
    }
  }
}