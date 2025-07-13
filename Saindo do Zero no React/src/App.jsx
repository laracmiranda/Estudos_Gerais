import { useRef } from "react";
import ItemLista from "./ItemLista";
import { useState } from "react";

function App() {
  //const listaMercado = ["Banana", "Maçã","Carne"];
  //listaMercado = []

  const [listaMercado, setListaMercado] = useState([]);
  //setListaMercado([])
  const inputAdicionar = useRef();

  const adicionarProduto = () => {
    const novaLista = [...listaMercado]; //cria uma nova lista com cópia
    const valorInput = inputAdicionar.current.value; //armazena o valor do input na variável

    if (valorInput){ //testa se o valor do input está vazio
      novaLista.push(valorInput); //adiciona o input na nova lista
      setListaMercado(novaLista); //alterou a variável de estado
      inputAdicionar.current.value = ""; //zerando valor do input
    }

    };

  return (
    <>
      <h1>📜 Lista de Mercado</h1>
      <input ref={inputAdicionar} type="text" placeholder="Digite um item" />
      <button onClick={() => adicionarProduto()}>+ Adicionar</button>

      {listaMercado.length > 0 ? ( 
        <ul>
        {listaMercado.map((itemLista, index) => (
          <ItemLista key={index} itemLista={itemLista} listaMercado={listaMercado} setListaMercado={setListaMercado}/>
        ))}
      </ul> 
      ) : (
      <p>Sua lista está vazia ☹️</p>
      )}

    </>
  );
}

export default App
