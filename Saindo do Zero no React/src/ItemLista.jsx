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
        <li>
            <p>{itemLista}</p>
            <button onClick={() => removerProduto()}>🗑️ Excluir</button>
        </li>
    )
};

export default ItemLista