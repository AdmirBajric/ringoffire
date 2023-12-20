import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent implements OnInit {
  constructor(private router: Router) {}

  firestore: Firestore = inject(Firestore);

  ngOnInit(): void {}

  newGame() {
    let game = new Game();
    const addToCollection = collection(this.firestore, 'games');
    addDoc(addToCollection, game.toJson()).then((gameInfo) => {
      this.router.navigateByUrl(`/game/${gameInfo.id}`);
    });
  }
}
