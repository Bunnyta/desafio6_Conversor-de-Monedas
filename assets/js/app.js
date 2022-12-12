const inputPesos = document.querySelector("#inputPesos");
const currency = document.querySelector("#currency");
const results = document.querySelector("#results");
const btnBuscar = document.querySelector("#btnBuscar");

const getMindicador = async () => {
    try {
        const res = await fetch("https://mindicador.cl/api");
        const data = await res.json();
        const optionDolarValue = data.dolar.valor;
        const optionEuroValue = data.euro.valor;

        const transformToDolar = (value) => inputPesos.value / value;
        const transformToEuro = (value) => inputPesos.value / value;

        btnBuscar.addEventListener("click", () => {
            if (inputPesos.value === "") {
                return alert("Ingresa un monto en CLP y elige una moneda");
            }

            if (currency.value === "dolar") {
                return (results.textContent = `$ ${Math.trunc(
                    transformToDolar(optionDolarValue)
                )}`);
            }

            if (currency.value === "euro") {
                return (results.textContent = `$ ${Math.trunc(
                    transformToEuro(optionEuroValue)
                )}`);
            }
        });
    } catch (error) {
        console.log(error);
    }
};
getMindicador();

let myChart;

async function getMonedas() {
    const endpoint = "https://api.gael.cloud/general/public/monedas";
    const res = await fetch(endpoint);
    const monedas = await res.json();
    console.log("Objeto Original de Api: ", monedas);
    return monedas;
}
function prepararConfiguracionParaLaGrafica(monedas) {
    const tipoDeGrafica = "line";
    const nombresDeLasMonedas = monedas.map((moneda) => moneda.Codigo);
    const titulo = "Monedas";
    const colorDeLinea = "red";
    const valores = monedas.map((moneda) => {
        const valor = moneda.Valor.replace(",", ".");
        return Number(valor);
    });
    console.log("Valores parseados del Objeto Original de Api: ", valores);
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: nombresDeLasMonedas,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    data: valores
                }
            ]
        }
    };
    return config;
}
async function renderGrafica() {
    const monedas = await getMonedas();  
    const config = prepararConfiguracionParaLaGrafica(monedas);
    const chartDOM = document.getElementById("myChart");
    if (myChart) {
        myChart.destroy(); 
    }
    myChart = new Chart(chartDOM, config)
}
renderGrafica();