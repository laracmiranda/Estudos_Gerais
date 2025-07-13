import React from 'react'

const ItemLista = ({itemLista, listaMercado, setListaMercado}) => {

    const removerProduto = () => {
        const novaLista =[...listaMercado]
        const novaListaFiltrada = novaLista.filter(
            (itemAtual) => itemAtual !== itemLista
        );

        setListaMercado(novaListaFiltrada);
    };

    return (
        <li className='flex justify-between gap-2 bg-purple-50 px-2 py-2 rounded-md'>
            <p>{itemLista}</p>
            <button className="rounded-md bg-rose-400 text-white px-2 cursor-pointer hover:bg-rose-300 transition" onClick={() => removerProduto()}>🗑️ Excluir</button>
        </li>
    )
};

export default ItemLista