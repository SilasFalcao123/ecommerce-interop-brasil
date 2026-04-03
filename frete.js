// frete.js - Cálculo de frete via XMLHttpRequest

function buscarFrete(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        tratarErro('CEP inválido. Digite 8 números.', 'resultado-frete');
        return;
    }
    
    // Abortar requisição anterior se existir
    abortarRequisicaoAnterior();
    
    const xhr = new XMLHttpRequest();
    requisicaoAtiva = xhr;
    
    // URL da API (exemplo com ViaCEP - pública)
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    
    // Mostrar loading
    mostrarSpinner('resultado-frete');
    
    // Configurar requisição assíncrona
    xhr.open('GET', url, true);
    xhr.timeout = 5000; // Timeout de 5 segundos
    
    // Callback para mudanças de estado
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            esconderSpinner('resultado-frete');
            
            if (xhr.status === 200) {
                const dados = JSON.parse(xhr.responseText);
                
                if (dados.erro) {
                    tratarErro('CEP não encontrado', 'resultado-frete');
                } else {
                    exibirFrete(dados);
                }
            } else {
                tratarErro(`Erro ${xhr.status}: ${xhr.statusText}`, 'resultado-frete');
            }
        }
    };
    
    // Tratamento de timeout
    xhr.ontimeout = function() {
        tratarErro('Tempo limite excedido. Tente novamente.', 'resultado-frete');
    };
    
    // Tratamento de erro de rede
    xhr.onerror = function() {
        tratarErro('Erro de rede. Verifique sua conexão.', 'resultado-frete');
    };
    
    // Enviar requisição
    xhr.send();
}

function exibirFrete(dados) {
    const container = document.getElementById('resultado-frete');
    
    // Simulação de cálculo de frete baseado no CEP
    const valorFrete = calcularFretePorRegiao(dados.uf);
    
    container.innerHTML = `
        <div class="frete-info">
            <p><strong>📦 Endereço:</strong> ${dados.logradouro}, ${dados.bairro}</p>
            <p><strong>🏙️ Cidade/UF:</strong> ${dados.localidade}/${dados.uf}</p>
            <p><strong>💰 Frete:</strong> R$ ${valorFrete.toFixed(2)}</p>
            <p><strong>⏱️ Prazo:</strong> ${calcularPrazo(dados.uf)} dias úteis</p>
        </div>
    `;
}

function calcularFretePorRegiao(uf) {
    // Regra de negócio fictícia
    const regioes = {
        'SP': 15.90, 'RJ': 18.50, 'MG': 22.30, 'ES': 25.00,
        'PR': 28.90, 'SC': 30.50, 'RS': 32.00,
        'BA': 35.00, 'PE': 38.00, 'CE': 40.00, 'outros': 45.00
    };
    return regioes[uf] || regioes['outros'];
}

function calcularPrazo(uf) {
    const prazos = {
        'SP': 2, 'RJ': 3, 'MG': 4, 'ES': 5,
        'PR': 6, 'SC': 7, 'RS': 8, 'outros': 10
    };
    return prazos[uf] || prazos['outros'];
}