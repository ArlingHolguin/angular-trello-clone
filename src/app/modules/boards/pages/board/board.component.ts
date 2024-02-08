import { Component , OnInit} from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { ToDo, Column } from '@models/todo.model';
import { ActivatedRoute } from '@angular/router';
import { BoardsService } from '@services/boards.service';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { CardsService } from '@services/cards.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { List } from '@models/list.model';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ListsService } from '@services/lists.service';
import { BACKGROUNDS } from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit{

  board: Board | null = null;
  faPlus = faPlus;
  showCardForm = false;
  colorsBackground = BACKGROUNDS;

  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]

  })

  showListForm = false;
  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]

  })

  

  constructor( 
    private dialog: Dialog,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private cardsService: CardsService,
    private listService: ListsService

    ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if(id){
        this.getBoard(id);
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    //after 
   const position =  this.boardsService.getPosition(event.container.data, event.currentIndex);
   const card = event.container.data[event.currentIndex];
   const listId = event.container.id;
    this.updateCardPosition(card, position, listId);


  }

  addList() {
    const title = this.inputList.value;
    if(this.board){
      this.listService.create({
        title,
        boardId: this.board.id,
        position: this.boardsService.getPositionNewItem(this.board.lists)
      }).subscribe(
        list =>{
          this.board?.lists.push({
            ...list,
            cards: []
          });
          this.inputList.setValue('');
          this.showListForm = false;
        }
      )
      

    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      if (output) {
        console.log(output);
      }
    });
  }

  getBoard(id: string) {
    this.boardsService.getBoard(id).subscribe((board) => {
      this.board = board;
    })
  }

  private updateCardPosition(card: Card, position: number, listId: number | string) {
    this.cardsService.update(card.id, { position, listId })
    .subscribe((card) => {
      console.log(card);
    });
  }

  openFormCard(list:List){
    if(this.board?.lists){
      this.board.lists = this.board.lists.map(iteratorList =>{
        if(iteratorList.id === list.id){
          return {
            ...iteratorList,
            showCardForm: true
          }

        }return{
          ...iteratorList,
            showCardForm: false
        }

      })

    }

  }

  
  createCard(list: List){
    const title = this.inputCard.value;
   if(this.board){
    this.cardsService.create({
      title,
      listId: list.id,
      boardId: this.board.id,
      position: this.boardsService.getPositionNewItem(list.cards)
    }).subscribe(
      card =>{
        list.cards.push(card);
        this.inputCard.setValue('');
        list.showCardForm = false;
      }
    )

   }
    
  }

  closeCardForm(list: List){
    list.showCardForm = false;

  }

  get colors(){
    if(this.board){
      const classes  = this.colorsBackground[this.board.backgroundColor];
      return classes ? classes : {};
    }
    return {}
  }
}
