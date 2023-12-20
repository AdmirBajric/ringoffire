import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    PlayerComponent,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  firestore: Firestore = inject(Firestore);

  isClassAdded: boolean = false;
  game: Game;
  gameId: string = '';

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.gameId = params['id'];

      const itemCollection = collection(this.firestore, 'games');
      onSnapshot(doc(itemCollection, this.gameId), (doc) => {
        const data = doc.data();

        if (data) {
          this.game.currentPlayer = data['currentPlayer'];
          this.game.playedCards = data['playedCards'];
          this.game.players = data['players'];
          this.game.stack = data['stack'];
          this.game.pickCardAnimation = data['pickCardAnimation'];
          this.game.currentCard = data['currentCard'];
        }
      });
    });
  }

  newGame() {}

  takeCard() {
    console.log(this.game.pickCardAnimation);
    console.log(this.game.players.length > 1);

    if (this.game.players.length > 1) {
      const card = this.game.stack.pop();

      if (card !== undefined) {
        this.game.currentCard = card;
        this.game.pickCardAnimation = true;
        this.saveGame();
      }

      setTimeout(() => {
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    } else {
      this.openDialog();
    }
  }

  openDialog(): void {
    if (this.game.players.length <= 7) {
      const dialogRef = this.dialog.open(DialogAddPlayerComponent);

      dialogRef.afterClosed().subscribe((name: string) => {
        if (name && name.length > 0) {
          let newName = name[0].toUpperCase() + name.slice(1).toLowerCase();
          this.game.players.push(newName);
          this.saveGame();

          if (this.game.players.length == 8) {
            this.isClassAdded = true;
          }
        }
      });
    }
  }

  saveGame() {
    const itemCollection = collection(this.firestore, 'games');
    const data = doc(itemCollection, this.gameId);
    updateDoc(data, this.game.toJson());
  }
}
