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

    if (valorInput){ //testa se o valor do input está preenchido
      novaLista.push(valorInput); //adiciona o input na nova lista
      setListaMercado(novaLista); //alterou a variável de estado
      inputAdicionar.current.value = ""; //zerando valor do input
    }

    };

  return (
    <div className="max-w-96 w-full flex flex-col items-center gap-4 bg-purple-200 px-3 py-4 rounded-md">
      <h1 className="text-3xl font-bold">📜 Lista de Mercado</h1>
      <div className="w-full flex gap-2">
        <input className="w-full rounded-md border border-gray-400 px-2 focus:bg-purple-50 focus:outline-purple-400" ref={inputAdicionar} type="text" placeholder="Digite um item" />
        <button className=" min-w-25 rounded-md bg-purple-400 text-white px-2 cursor-pointer hover:bg-purple-500 transition" onClick={() => adicionarProduto()}>+ Adicionar</button>
      </div>

      {listaMercado.length > 0 ? ( 
        <ul className="w-full flex flex-col gap-2">
        {listaMercado.map((itemLista, index) => (
          <ItemLista key={index} itemLista={itemLista} listaMercado={listaMercado} setListaMercado={setListaMercado}/>
        ))}
      </ul> 
      ) : (
      <p>Sua lista está vazia ☹️</p>
      )}

    </div>
  );
}

export default App
