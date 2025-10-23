document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.querySelector("#produtosTable tbody");
    const filtro = document.querySelector("#filterInput");

    async function carregarProdutos() {
        const response = await fetch("/api/products/");
        const produtos = await response.json();
        tabela.innerHTML = "";

        produtos.forEach(produto => {
            const tr = document.createElement("tr");
            
            // CORREÇÃO: Conversão de preço e uso do toFixed(2)
            const precoNumerico = parseFloat(produto.preco); 
            
            tr.innerHTML = `
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>R$ ${precoNumerico.toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                <td>
                    <a class="btn btn-edit" href="/products/edit/${produto.id}/">Editar</a>
                    <button class="btn btn-danger" onclick="desativarProduto(${produto.id})">Desativar</button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    }

    // ADICIONADO: Verificação if(filtro) para garantir que o listener só seja anexado se o elemento existir
    if (filtro) {
        filtro.addEventListener("input", async () => {
            const nome = filtro.value.trim();
            tabela.innerHTML = ""; // Limpa a tabela imediatamente

            // Lógica de Pesquisa: Faz a busca somente se houver algo digitado
            if (nome.length > 0) {
                const response = await fetch(`/api/products/?search=${encodeURIComponent(nome)}`);
                const produtos = await response.json();
                
                produtos.forEach(produto => {
                    const tr = document.createElement("tr");
                    
                    // CORREÇÃO: Conversão de preço e uso do toFixed(2)
                    const precoNumerico = parseFloat(produto.preco); 
                    
                    tr.innerHTML = `
                        <td>${produto.codigo}</td>
                        <td>${produto.nome}</td>
                        <td>R$ ${precoNumerico.toFixed(2)}</td>
                        <td>${produto.estoque}</td>
                        <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                        <td>
                            <a href="/products/edit/${produto.id}/">Editar</a>
                            <button onclick="desativarProduto(${produto.id})">Desativar</button>
                        </td>
                    `;
                    tabela.appendChild(tr);
                });
            } else {
                // Lógica de Limpeza: Se o campo de busca está vazio, recarrega todos os produtos
                carregarProdutos(); 
            }
        });
    }

    window.desativarProduto = async (id) => {
        if (confirm("Deseja realmente desativar este produto?")) {
            await fetch(`/api/products/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ativo: false })
            });
            carregarProdutos();
        }
    };

    carregarProdutos();
});