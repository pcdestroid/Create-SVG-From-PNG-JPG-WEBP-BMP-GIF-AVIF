// Cria um elemento SVG 
const svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

const main = document.querySelector('.main');
const imagemSVG = document.querySelector('.imagemSVG');
const urlData = document.querySelector('.urlData');
const size = document.querySelector('.size');
const sizeSVG = document.querySelector('.sizeSVG');
const btnCopyLink = document.querySelector('.copyLink')
const widthImg = document.querySelector('.width-img')
const heightImg = document.querySelector('.height-img')

let file;

// Obtém o elemento de entrada de arquivo
const inputFile = document.querySelector('.send');

// Define o manipulador de eventos para quando o arquivo for selecionado
inputFile.addEventListener('change', function (event) {

    // Obtém o arquivo selecionado
    file = event.target.files[0];

    // Obter o tamanho do arquivo em bytes
    var fileSizeInBytes = file.size;

    // Converter o tamanho do arquivo em kilobytes (KB)
    var fileSizeInKB = fileSizeInBytes / 1024;

    // Exibir o tamanho do arquivo
    size.innerHTML = "Tamanho original: " + fileSizeInKB.toFixed(2) + " KB"

    const reader = new FileReader();
    reader.onload = function () {
        // Chama a função createSVGFromJPG com o arquivo selecionado
        createSVGFromJPG(reader.result);
    };
    reader.readAsDataURL(file);
});

widthImg.addEventListener('change', function (event) {

    // Obter o tamanho do arquivo em bytes
    var fileSizeInBytes = file.size;
    // Converter o tamanho do arquivo em kilobytes (KB)
    var fileSizeInKB = fileSizeInBytes / 1024;
    // Exibir o tamanho do arquivo
    size.innerHTML = "Tamanho original: " + fileSizeInKB.toFixed(2) + " KB"
    const reader = new FileReader();
    reader.onload = function () {
        // Chama a função createSVGFromJPG com o arquivo selecionado
        createSVGFromJPG(reader.result);
    };
    reader.readAsDataURL(file);
});



function createSVGFromJPG(filePath) {
    btnCopyLink.innerHTML = 'Copy Link'

    // Cria um objeto Image
    const img = new Image();




    // Define o manipulador de eventos para quando a imagem for carregada
    img.onload = function () {

        let iw = img.width;
        let ih = img.height;

        heightImg.value = (img.height * widthImg.value) / img.width

        if (widthImg.value * heightImg.value > 0) {
            iw = widthImg.value;
            ih = heightImg.value;
        }

        // Cria um canvas para desenhar a imagem
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = iw;
        canvas.height = ih;
        ctx.drawImage(img, 0, 0, iw, ih);
        // Converte o canvas em um objeto Blob
        canvas.toBlob(function (blob) {

            let sizeAproximado = (389 * (blob.size / 1024)) / 292.21875
            sizeSVG.innerHTML = "Tamanho aproximado em SVG: " + sizeAproximado.toFixed(2) + " KB"
            // Cria um objeto FileReader para ler o arquivo como uma URL de dados
            var reader = new FileReader();
            // Define o manipulador de eventos para quando o arquivo for lido
            reader.onload = function () {

                // Cria um elemento de imagem SVG
                svgImage.setAttributeNS(null, "width", iw);
                svgImage.setAttributeNS(null, "height", ih);
                svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', reader.result);

                // Adiciona  a imagem ao SVG
                svg.setAttributeNS(null, "viewBox", `0 0 ${iw} ${ih}`);
                svg.setAttributeNS(null, "width", iw);
                svg.setAttributeNS(null, "height", ih);
                svg.appendChild(svgImage);

                // Adiciona o elemento SVG ao documento
                imagemSVG.appendChild(svg);

                let imageElement = document.querySelector('image')
                let hrefValue = imageElement.getAttribute('href');
                urlData.value = hrefValue
                document.body.style.backgroundImage = `url('${filePath}')`

            }

            // Lê o arquivo como uma URL de dados
            reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.95);
    }

    // Carrega a imagem a partir do caminho do arquivo
    img.src = filePath;

}

async function downloadSVG() {
    if (imagemSVG.innerHTML == '') {
        size.innerHTML = 'No file chosen'
    } else {
        // Converte o elemento SVG em uma string
        let svgString = new XMLSerializer().serializeToString(svg);
        // Cria um objeto Blob a partir da string SVG
        let blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        // Cria um link de download
        let link = document.createElement('a');
        link.setAttribute('download', 'imagem.svg');
        link.setAttribute('href', URL.createObjectURL(blob));
        // Simula o clique no link para iniciar o download
        link.click();
    }
}

// Adicione manipuladores de eventos para dragover, dragenter e drop
['dragover', 'dragenter'].forEach(eventName => {
    main.addEventListener(eventName, e => {
        e.preventDefault();
        main.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    main.addEventListener(eventName, e => {
        e.preventDefault();
        main.classList.remove('dragover');
    }, false);
});

main.addEventListener('drop', e => {

    try {
        e.preventDefault();

        inputFile.files = e.dataTransfer.files;



        // Obtém o arquivo selecionado
        file = inputFile.files[0];

        // Obter o tamanho do arquivo em bytes
        var fileSizeInBytes = file.size;

        // Converter o tamanho do arquivo em kilobytes (KB)
        var fileSizeInKB = fileSizeInBytes / 1024;

        // Exibir o tamanho do arquivo
        size.innerHTML = "Tamanho original: " + fileSizeInKB.toFixed(2) + " KB"

        const reader = new FileReader();
        reader.onload = function () {
            // Chama a função createSVGFromJPG com o arquivo selecionado
            createSVGFromJPG(reader.result);
        };
        reader.readAsDataURL(file);
    } catch (e) { }

});

function copyLink() {
    if (imagemSVG.innerHTML == '') {
        size.innerHTML = 'No links to be copied'
    } else {
        navigator.clipboard.writeText(urlData.value);
        btnCopyLink.innerHTML = 'Copied link...'
    }
}
