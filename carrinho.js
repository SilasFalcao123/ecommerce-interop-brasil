// carrinho.js - Adicionar/remover itens do carrinho via XHR

let carrinho = [];

function adicionarAoCarrinho(produtoId) {
    const xhr = new XMLHttpRequest();
    const url = 'https://api.ecommerce.com.br/carrinho';
    
    mostrarSpinner('carrinho-status');
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    const dados = {
        produtoId: produtoId,
        quantidade: 1,
        timestamp: new Date().toISOString()
    };
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            esconderSpinner('carrinho-status');
            
            if (xhr.status === 201) {
                const resposta = JSON.parse(xhr.responseText);
                atualizarContadorCarrinho(resposta.totalItens);
                mostrarNotificacao('Produto adicionado ao carrinho!');
            } else {
                tratarErro('Erro ao adicionar produto', 'carrinho-status');
            }
        }
    };
    
    xhr.send(JSON.stringify(dados));
}

function carregarCarrinho() {
    const xhr = new XMLHttpRequest();
    const url = 'https://api.ecommerce.com.br/carrinho';
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            carrinho = JSON.parse(xhr.responseText);
            exibirResumoCarrinho();
        }
    };
    xhr.send();
}

function atualizarContadorCarrinho(total) {
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        contador.textContent = total;
    }
}

function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    
    setTimeout(() => notificacao.remove(), 3000);
}