import { Component, Input, SimpleChange } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-str',
  templateUrl: './password-str.component.html',
  styleUrl: './password-str.component.scss',
  standalone:false
})
export class PasswordStrComponent {
 bar0: string = '';
  @Input() public passwordToCheck: string | undefined | null;
  bar1: string = '';
  bar2: string = '';
  bar3: string = '';
  msg: string = '';
  msgColor: string = '';
  private colors = ['#FA4040', '#F9A559', '#33DB39', '#21C127'];
  constructor( private translate: TranslateService){}
  checkStrength(p: any) {
    // 1
    let force = 0;

    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * p.length + (p.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // 6
    force = p.length <= 6 ? Math.min(force, 10) : force;

    // 7
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    force = passedMatches === 4 ? Math.min(force, 40) : force;

    return force;
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;
    this.setBarColors(4, '#DDD');
    if (password) {
      const c = this.getColor(this.checkStrength(password));
      this.setBarColors(c.index, c.color);
    } else this.msg = '';
    const pwdStrength = this.checkStrength(password);
    switch (pwdStrength) {
      case 10:
        this.msg = this.translate.instant('weak');
        break;
      case 20:
        this.msg = this.translate.instant('Average');
        break;
      case 30:
        this.msg =this.translate.instant('Good'); 
        break;
      case 40:
        this.msg = this.translate.instant('strong'); 
        break;
    }
  }

  private getColor(s: any) {
    let index = 0;
    if (s === 10) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } else if (s === 40) {
      index = 3;
    } else {
      index = 4;
    }
    this.msgColor = this.colors[index];
    return {
      index: index + 1,
      color: this.colors[index],
    };
  }

  private setBarColors(count: any, col: any) {
    for (let n = 0; n < count; n++) {
      if (n == 0) this['bar0'] = col;
      else if (n == 1) this['bar1'] = col;
      else if (n == 2) this['bar2'] = col;
      else if (n == 3) this['bar3'] = col;
    }
  }
}
