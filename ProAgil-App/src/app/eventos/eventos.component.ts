import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { ToastrService } from 'ngx-toastr';
// import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
// defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';
  dataEvento: string;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private toastr: ToastrService
    ) { }

  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ?  this.filtrarEvento(this.filtroLista) : this.eventos;
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show(template);

  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEvento(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required ],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  salvarAlteracao(template: any){

    if (this.registerForm.valid){
      this.evento = Object.assign({}, this.registerForm.value);
      let is_insert = (this.evento.id == null ? true : false);
      if (is_insert){
        delete this.evento.id;
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso');
          },
          error => {
            console.log(error);
          }
        );
      }else{
        this.eventoService.putEvento(this.evento.id, this.evento).subscribe(
          (retorno: any) => {
            console.log(retorno);
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso');

          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  getEventoEditModal(id : number){
    this.eventoService.getEventoById(id).subscribe(
      (evento: Evento) =>
    {
      this.registerForm = this.fb.group({
        id : [evento.id, [] ],
        tema: [evento.tema, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: [evento.local, Validators.required ],
        dataEvento: [evento.dataEvento, Validators.required],
        qtdPessoas: [evento.qtdPessoas.toString(), [Validators.required, Validators.max(120000)]],
        imagemURL: [evento.imagemURL, Validators.required],
        telefone: [evento.telefone, Validators.required],
        email: [evento.email, [Validators.required, Validators.email]]
      });
    },error => {
      console.log(error);
    }
    );
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_evento: Evento[]) =>
    {
      this.eventos = _evento;
      
      this.eventosFiltrados = this.eventos;
    },error => {
      console.log(error);
    }
    );
  }

  excluirEvento (evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete (template: any){
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com Sucesso');
      }, error => {
        this.toastr.error('erro ao tentar deletar');
        console.log(error);

      }
    )
  }

}
