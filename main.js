// main.js - Ponto de entrada da aplicação

// Aguardar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('E-commerce iniciado - Processamento assíncrono com XHR');
    
    // Carregar produtos iniciais
    carregarProdutos('promocoes');
    
    // Carregar carrinho do usuário
    carregarCarrinho();
    
    // Configurar eventos da interface
    configurarEventos();
});

function configurarEventos() {
    // Evento para busca de CEP (ao sair do campo)
    const cepInput = document.getElementById('cep-input');
    if (cepInput) {
        cepInput.addEventListener('blur', function() {
            if (this.value.length === 8) {
                buscarFrete(this.value);
            }
        });
    }
    
    // Evento para botão de buscar CEP
    const buscarCepBtn = document.getElementById('buscar-cep');
    if (buscarCepBtn) {
        buscarCepBtn.addEventListener('click', function() {
            const cep = document.getElementById('cep-input').value;
            buscarFrete(cep);
        });
    }
    
    // Detectar scroll para lazy loading
    window.addEventListener('scroll', function() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.body.offsetHeight;
        
        if (scrollPosition >= pageHeight - 500) {
            carregarMaisProdutos();
        }
    });
    
    // Atualizar frete ao mudar quantidade no carrinho
    const quantidadeSelect = document.getElementById('quantidade');
    if (quantidadeSelect) {
        quantidadeSelect.addEventListener('change', function() {
            recalcularFrete();
        });
    }
}

function recalcularFrete() {
    const cep = document.getElementById('cep-input').value;
    if (cep && cep.length === 8) {
        buscarFrete(cep);
    }
}

// Exportar funções globais (para uso em onclick no HTML)
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.carregarProdutos = carregarProdutos;
window.buscarFrete = buscarFrete;