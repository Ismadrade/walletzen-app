import { Component, OnInit, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { fromEvent, map } from 'rxjs';

export const SCROLL_CONTAINER = 'mat-sidenav-content';
export const TEXT_LIMIT = 50;
export const SHADOW_LIMIT = 100;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public isSmallScreen = false;
  public popText = false;
  public applyShadow = false;

  dataSource = MENU_ITEMS;

  childrenAccessor = (node: MenuNode) => node.children ?? [];

  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    const content = document.getElementsByClassName(SCROLL_CONTAINER)[0];

    fromEvent(content, 'scroll')
      .pipe(
        map(() => content.scrollTop)
      )
      .subscribe({
        next: (value: number) => this.determineHeader(value)
      })
  }

  determineHeader(scrollTop: number) {
    this.popText = scrollTop >= TEXT_LIMIT;
    this.applyShadow = scrollTop >= SHADOW_LIMIT;
  }

  ngAfterContentInit(): void {
    this.breakpointObserver
        .observe(['(max-width: 800px)'])
        .subscribe((res) => this.isSmallScreen = res.matches);
  }

  get sidenavMode() {
    return this.isSmallScreen ? 'over' : 'side';
  }
}

const MENU_ITEMS: MenuNode[] = [
  {
    name: 'Usuário',
    children: [{name: 'Perfil', url: '/pages/users', icon: 'person'}],
  },
  {
    name: 'Transações',
    children: [
      { name: 'Minhas Transações', icon: 'account_balance_wallet'},
      { name: 'Nova Transação', icon: 'add_card'},
    ],
  },
];


interface MenuNode {
  name: string;
  children?: MenuNode[];
  url?: string;
  icon?: string;
}
