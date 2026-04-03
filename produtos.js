// produtos.js - Carregamento assíncrono de produtos

let requisicaoProdutos = null;

function carregarProdutos(categoria = 'promocoes') {
    // Abortar requisição anterior
    if (requisicaoProdutos && requisicaoProdutos.readyState !== 4) {
        requisicaoProdutos.abort();
    }
    
    const xhr = new XMLHttpRequest();
    requisicaoProdutos = xhr;
    
    // URL da API (substituir pela URL real do backend)
    const url = `https://api.ecommerce.com.br/produtos?categoria=${categoria}`;
    
    mostrarSpinner('produtos-container');
    
    xhr.open('GET', url, true);
    xhr.timeout = 8000;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            esconderSpinner('produtos-container');
            
            if (xhr.status === 200) {
                const produtos = JSON.parse(xhr.responseText);
                exibirProdutos(produtos);
            } else if (xhr.status === 404) {
                tratarErro('Categoria não encontrada', 'produtos-container');
            } else {
                tratarErro(`Erro ao carregar produtos: ${xhr.status}`, 'produtos-container');
            }
        }
    };
    
    xhr.ontimeout = () => tratarErro('Timeout ao carregar produtos', 'produtos-container');
    xhr.onerror = () => tratarErro('Falha na conexão com o servidor', 'produtos-container');
    
    xhr.send();
}

function exibirProdutos(produtos) {
    const container = document.getElementById('produtos-container');
    
    if (!produtos || produtos.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
        return;
    }
    
    let html = '<div class="produtos-grid">';
    produtos.forEach(produto => {
        html += `
            <div class="produto-card" data-id="${produto.id}">
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
                <h3>${produto.nome}</h3>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <p class="parcelamento">até ${produto.parcelas}x de R$ ${(produto.preco / produto.parcelas).toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho(${produto.id})" class="btn-comprar">
                    🛒 Adicionar ao carrinho
                </button>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Carregar mais produtos (lazy loading)
let paginaAtual = 1;
let carregandoMais = false;

function carregarMaisProdutos() {
    if (carregandoMais) return;
    
    carregandoMais = true;
    paginaAtual++;
    
    const xhr = new XMLHttpRequest();
    const url = `https://api.ecommerce.com.br/produtos?pagina=${paginaAtual}`;
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const novosProdutos = JSON.parse(xhr.responseText);
            adicionarProdutosAoFinal(novosProdutos);
            carregandoMais = false;
        }
    };
    xhr.send();
}