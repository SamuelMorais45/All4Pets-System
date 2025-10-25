document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = typeof IS_ADMIN !== 'undefined' && IS_ADMIN;

    const tabela = document.querySelector("#produtosTable tbody");
    const filtro = document.querySelector("#filterInput");

    const renderizarProdutos = (produtos) => {
        tabela.innerHTML = "";

        produtos.forEach(produto => {
            const tr = document.createElement("tr");

            const precoNumerico = parseFloat(produto.preco) || 0;
            const estoqueNumerico = produto.estoque || 0;
            
            let acoesHtml = '';
            let acoesTd = '';
            
            if (isAdmin) {
                acoesHtml = `
                    <a class="btn btn-edit" href="/products/edit/${produto.id}/">Editar</a>
                    <button class="btn btn-danger" onclick="desativarProduto(${produto.id})">Desativar</button>
                `;
                acoesTd = `<td>${acoesHtml}</td>`;
            }
            
            tr.innerHTML = `
                <td>${produto.codigo}</td>
                <td>${produto.nome}</td>
                <td>R$ ${precoNumerico.toFixed(2)}</td>
                <td>${estoqueNumerico}</td>
                <td>${produto.data_validade}</td>
                <td>${produto.ativo ? "Ativo" : "Inativo"}</td>
                ${acoesTd}
            `;
            tabela.appendChild(tr);
        });
    }

    async function carregarProdutos() {
        const cacheBuster = new Date().getTime();
        const response = await fetch(`/api/products/?timestamp=${cacheBuster}`);

            if (!response.ok) {
            console.error("Erro ao carregar produtos. Status:", response.status);
            tabela.innerHTML = '<tr><td colspan="5">Não foi possível carregar a lista de produtos (Verifique o log de erro no servidor).</td></tr>'; 
            return;
            }

        const produtos = await response.json();
        renderizarProdutos(produtos);
    }

    if (filtro) {
        filtro.addEventListener("input", async () => {
            const nome = filtro.value.trim();
            
            if (nome.length > 0) {
                const response = await fetch(`/api/products/?search=${encodeURIComponent(nome)}`);
                if (!response.ok) {
                    console.error("Erro na busca por produtos. Status:", response.status);
                    tabela.innerHTML = '<tr><td colspan="5">Erro ao buscar.</td></tr>';
                    return;
                }

                const produtos = await response.json();
                renderizarProdutos(produtos);
            } else {
                carregarProdutos();
            }
        });
    }

    window.desativarProduto = async (id) => {
        if (confirm("Deseja realmente desativar este produto?")) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch(`/api/products/${id}/`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken 
                },
                body: JSON.stringify({ ativo: false })
            });
        
            if (!response.ok) {
                alert("Erro ao desativar produto. Verifique suas permissões.");
            }
        
            carregarProdutos();
        }
    };

    carregarProdutos();
});