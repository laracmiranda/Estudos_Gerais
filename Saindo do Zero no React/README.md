Vídeo aula [**Como sair do Zero no React em Apenas UMA AULA**](https://www.youtube.com/watch?v=6hiqVVCsA_I) do Canal Hashtag Programação

Primeiro instalamos o Vite e configuramos ele para usar React
npm create vite@latest

Depois é preciso rodar os comandos:
npm install -> Para instalar as dependências do arquivo package.json
npm run dev -> Vai rodar o servidor local

Conceitos
Componente em React: Entidade que representa algo na página. Funcionam de forma independente
Tag vazia em React se chama "Fragment". Utilizada porque o return só retorna 1 elemento, então ela conta como um elemento só no return, porém dentro dela contém diversos outros elementos.
StrictMode: Usado apenas na forma de desenvolvimento para testar o aplicativo, fazendo com que o componente renderize duas vezes

Extensão para VSCODE 
ES7 + React/Reduc
Atalho: rafce -> Cria um componente padrão dentro de um novo arquivo
react arrow function component exrpot

Importante sempre importar os pacotes e componentes que está utilizando antes
Prop: Parâmetros que passamos para componentes

Erro
Each child in a list should have a unique "key" prop.
Cada filho em uma lista no react precisa ter uma chave única
Por que? É a forma do react identificar e conseguir implementar a lógica dos componentes, para saber quais devem ser renderizados, etc.

Hooks
useState: Cria uma variável de estado
Ele não retorna uma informação e sim um array [A variável que armazena a informação, uma função para alterar essa variável]

useRef: Cria uma referência dentro de uma variável

Tailwind

Instalando o tailwind com Vite
npm install tailwindcss @tailwindcss/vite

Extensão do VSCode
Tailwind CSS IntelliSense

Dependência de desenvolvimento para organizar o código
Tailwind com prettier
npm install -D prettier prettier-plugin-tailwindcss

Adiciona esse plugin dentro do package.json
"prettier": {
  "plugins": ["prettier-plugin-tailwindcss"]
},
