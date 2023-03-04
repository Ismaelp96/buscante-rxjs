import { switchMap, map, tap, filter, debounceTime } from 'rxjs';
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

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSE),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap((retornoAPI) => console.log('Fluxo inicial', retornoAPI)),
    switchMap((valodrDigitado) => this.service.buscar(valodrDigitado)),
    tap((retornoApi) => console.log(retornoApi)),
    map((items) => this.livrosResultadoParaLivros(items))
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
