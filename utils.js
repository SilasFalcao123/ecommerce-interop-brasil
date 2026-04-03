// utils.js - Funções auxiliares para processamento assíncrono

// Mostrar indicador de carregamento
function mostrarSpinner(elementoId) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.innerHTML = '<div class="spinner">Carregando...</div>';
    }
}

// Esconder indicador de carregamento
function esconderSpinner(elementoId) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        const spinner = elemento.querySelector('.spinner');
        if (spinner) spinner.remove();
    }
}

// Tratamento de erros padronizado
function tratarErro(mensagem, elementoId) {
    console.error('Erro na requisição:', mensagem);
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.innerHTML = `<div class="erro">❌ ${mensagem}</div>`;
        setTimeout(() => {
            const erroDiv = elemento.querySelector('.erro');
            if (erroDiv) erroDiv.remove();
        }, 5000);
    }
}

// Abortar requisição anterior (se existir)
let requisicaoAtiva = null;
function abortarRequisicaoAnterior() {
    if (requisicaoAtiva && requisicaoAtiva.readyState !== 4) {
        requisicaoAtiva.abort();
        console.log('Requisição anterior abortada');
    }
}