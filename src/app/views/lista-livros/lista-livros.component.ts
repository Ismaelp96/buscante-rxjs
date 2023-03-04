import { LivrosResultado } from './../../models/interfaces';
import {
  switchMap,
  map,
  tap,
  filter,
  debounceTime,
  distinctUntilChanged,
  catchError,
  throwError,
  EMPTY,
  of,
} from 'rxjs';
import { Component } from '@angular/core';
import { LivroService } from 'src/app/service/livro.service';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSE = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSE),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => (this.livrosResultado = resultado)),
    tap((retornoAPI) => console.log(retornoAPI)),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      // this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'
      // return EMPTY
      console.log(erro);
      return throwError(
        () =>
          new Error(
            (this.mensagemErro =
              'Ops, ocorreu um erro. Recarregue a aplicação!')
          )
      );
    })
  );
  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
