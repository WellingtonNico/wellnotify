# WellNotify

lib js baseada na lib [react-toastify](https://fkhadra.github.io/react-toastify/introduction) para notificações no template html



## Como usar?

* faça o download do arquivo wellnotify.js;
* inclua o script no seu html. Ex:
```html
<!-- wellnotify -->
<script src="/static/js/wellnotify.js"></script>
```
* crie uma instancia da classe WellNotify ou use a que já vem pré instanciada: wellNotify. Ex:
```js
const myWellNotify = new WellNotify({ posicao: "fundo-direito" })
```
* a partir da instância use o método notificar. Ex: 
```js
// o método "notificar" retorna a referência da própria notificação
const notificacao = wellNotify.notificar('iiihull, o Wellington mandou bem!','success');

notificacao.addEventListener('click',()=>alert('Evento adicional'))
```
* se for necessário limpar as notificações use
```js
myWellNotify.limpar()
```


## Tipos de notificação:
são auto explicativos
* `success`
* `warning`
* `error`
* `info`
* `default`



## Opções
as opções padrão podem ser definidas ao criar a instancia ou no terceiro argumento do método `notificar`:

* `[opcoes.posicao='topo-direito']` - (deve ser definido ao instanciar a classe) valores possíveis e auto explicativos:  `topo-direito` | `topo-esquerdo` | `fundo-direito` | `fundo-esquerdo`;
* `[opcoes.duracao=3000]` - duração da notificação em milisegundos;
* `[opcoes.autoFechar=true]` - se verdadeiro a notificação será fechada automaticamente após o tempo do argumento `duracao`;
* `[opcoes.fecharAoClicar=true]` - se verdadeiro a notificação pode ser fechada ao clicar no corpo sem a necessidade de clicar no botão de fechar;
* `[opcoes.aoClicar=undefined]` - (deve ser definido ao chamar o método `notificar`) caso for informado, um evento on click será adicionaro a notificação e será disparado ao clicar no corpo da mesma.