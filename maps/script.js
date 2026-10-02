const botaoLocalizacao = document.querySelector("#btn-localizacao");

const latitude = document.querySelector("#latitude");
const longitude = document.querySelector("#longitude");

const status = document.querySelector("#status");

const ultimaLocalizacao =
    document.querySelector("#ultima-localizacao");

const mapa = document.querySelector("#mapa");

const papel = document.querySelector("#papel");
const lixeira = document.querySelector("#lixeira");


// =====================================
// MOSTRAR LOCALIZAÇÃO SALVA
// =====================================

function mostrarUltimaLocalizacao() {

    const latSalva = localStorage.getItem("latitude");
    const longSalva = localStorage.getItem("longitude");

    if (latSalva && longSalva) {

        latitude.textContent = latSalva;
        longitude.textContent = longSalva;

        ultimaLocalizacao.textContent =
            `Sua última localização salva foi: ${latSalva} / ${longSalva}`;

        mostrarMapa(latSalva, longSalva);

    } else {

        ultimaLocalizacao.textContent =
            "Nenhuma localização salva ainda.";
    }
}


// =====================================
// MOSTRAR MAPA
// =====================================

function mostrarMapa(lat, long) {

    mapa.innerHTML = `
        <iframe
            src="https://www.google.com/maps?q=${lat},${long}&z=16&output=embed"
            loading="lazy"
            allowfullscreen>
        </iframe>
    `;
}


// =====================================
// PEGAR LOCALIZAÇÃO
// =====================================

function pegarLocalizacao() {

    status.textContent =
        "📡 Procurando sua localização...";

    botaoLocalizacao.textContent =
        "📡 Buscando localização...";


    // Verificar se o navegador possui geolocalização

    if (!navigator.geolocation) {

        status.textContent =
            "❌ Seu navegador não suporta localização.";

        botaoLocalizacao.textContent =
            "📍 Encontrar minha localização";

        return;
    }


    // Pegar localização

    navigator.geolocation.getCurrentPosition(

        function(posicao) {

            const lat =
                posicao.coords.latitude.toFixed(6);

            const long =
                posicao.coords.longitude.toFixed(6);


            // Mostrar coordenadas

            latitude.textContent = lat;
            longitude.textContent = long;


            // Mostrar status

            status.textContent =
                "✅ Localização encontrada com sucesso!";


            // =================================
            // SALVAR NO LOCALSTORAGE
            // =================================

            localStorage.setItem(
                "latitude",
                lat
            );

            localStorage.setItem(
                "longitude",
                long
            );


            // =================================
            // MOSTRAR MENSAGEM
            // =================================

            ultimaLocalizacao.textContent =
                `Sua última localização salva foi: ${lat} / ${long}`;


            // =================================
            // MOSTRAR MAPA
            // =================================

            mostrarMapa(lat, long);


            // =================================
            // ALTERAR BOTÃO
            // =================================

            botaoLocalizacao.textContent =
                "🔄 Atualizar minha localização";

        },


        // =================================
        // CASO DÊ ERRO
        // =================================

        function(erro) {

            if (erro.code === 1) {

                status.textContent =
                    "❌ Você não permitiu o acesso à localização.";

            } else if (erro.code === 2) {

                status.textContent =
                    "❌ Não foi possível encontrar sua localização.";

            } else if (erro.code === 3) {

                status.textContent =
                    "❌ A localização demorou muito para responder.";

            } else {

                status.textContent =
                    "❌ Ocorreu um erro ao obter a localização.";
            }


            botaoLocalizacao.textContent =
                "📍 Tentar novamente";
        },


        // =================================
        // OPÇÕES DA LOCALIZAÇÃO
        // =================================

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// =====================================
// BOTÃO DE LOCALIZAÇÃO
// =====================================

botaoLocalizacao.addEventListener(
    "click",
    pegarLocalizacao
);


// =====================================
// DRAG AND DROP
// =====================================


// Quando começar a arrastar o papel

papel.addEventListener(
    "dragstart",
    function(evento) {

        evento.dataTransfer.setData(
            "text",
            "papel"
        );

        lixeira.classList.add("destino");
    }
);


// =====================================
// QUANDO PASSAR SOBRE A LIXEIRA
// =====================================

lixeira.addEventListener(
    "dragover",
    function(evento) {

        evento.preventDefault();
    }
);


// =====================================
// QUANDO SOLTAR O PAPEL
// =====================================

lixeira.addEventListener(
    "drop",
    function(evento) {

        evento.preventDefault();


        const objeto =
            evento.dataTransfer.getData("text");


        if (objeto === "papel") {

            // =================================
            // APAGAR OS DADOS DO LOCALSTORAGE
            // =================================

            localStorage.removeItem("latitude");
            localStorage.removeItem("longitude");


            // =================================
            // LIMPAR COORDENADAS
            // =================================

            latitude.textContent = "--";
            longitude.textContent = "--";


            // =================================
            // ALTERAR MENSAGEM
            // =================================

            ultimaLocalizacao.textContent =
                "🗑️ A localização salva foi apagada!";


            status.textContent =
                "🧹 Localização removida com sucesso.";


            // =================================
            // LIMPAR MAPA
            // =================================

            mapa.innerHTML = `
                <div class="mapa-vazio">

                    <span>🗑️</span>

                    <h3>Localização apagada</h3>

                    <p>
                        O mapa foi limpo porque os dados
                        foram removidos.
                    </p>

                </div>
            `;


            // =================================
            // REMOVER DESTAQUE DA LIXEIRA
            // =================================

            lixeira.classList.remove("destino");
        }
    }
);


// =====================================
// QUANDO TERMINAR DE ARRASTAR
// =====================================

papel.addEventListener(
    "dragend",
    function() {

        lixeira.classList.remove("destino");
    }
);


// =====================================
// CARREGAR DADOS AO ABRIR A PÁGINA
// =====================================

mostrarUltimaLocalizacao();

