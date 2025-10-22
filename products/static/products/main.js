document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.querySelector("#produtosTable tbody");
    const filtro = document.querySelector("#filterInput");

    async function carregarProdutos() {
        const response = await fetch("/api/products/");
        const produtos = await response.json();
        tabela.innerHTML = "";

        produtos.forEach(produto => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                <td>
                    <a href="/products/edit/${produto.id}/">Editar</a>
                    <button onclick="desativarProduto(${produto.id})">🗑</button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    }

    filtro.addEventListener("input", async () => {
        const nome = filtro.value.trim();
        const response = await fetch(`/api/products/?nome=${nome}`);
        const produtos = await response.json();
        tabela.innerHTML = "";
        produtos.forEach(produto => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                <td>
                    <a href="/products/edit/${produto.id}/">Editar</a>
                    <button onclick="desativarProduto(${produto.id})">🗑</button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    });

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
