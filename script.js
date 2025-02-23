const PI = 3.14159265;
const DELAYSPEED = 50;
const output = document.getElementById('output');
const error = document.getElementById('error');
const pizzaOutput = document.getElementById('pizzaOutput');
const submit = document.getElementById('submit');
const resetDiv = document.getElementById('resetDiv');
const reset = document.getElementById('reset');
const inputs = document.querySelectorAll('.num-imput');
const pizza1 = document.getElementById('pizza1');
const pizza2 = document.getElementById('pizza2');
const pizza1Price = document.getElementById('pizza1Price');
const pizza2Price = document.getElementById('pizza2Price');
const priceSlider = document.getElementById('priceSlider');
const pizza1Slices = document.getElementById('pizza1Slices');
const pizza2Slices = document.getElementById('pizza2Slices');
const sliceSlider = document.getElementById('sliceSlider');
const mathSlider = document.getElementById('mathSlider');
const outputTable = document.getElementById('outputTable');
const resetter = document.querySelectorAll('.resetter');
const themeToggle = document.getElementById('themeToggle');
const inputSliders = document.querySelectorAll('.input-slider');
let isLightMode = true;
let delay = 0;
const pizzas = {
    smallPizza: {},
    largePizza: {},
    totalPizzaDiff: 0,
    percentageDiff: 0,
}

//
// Listeners
//

inputs.forEach((input) => {
    input.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkAndSubmit();
            scrollToResult();
        }

        isValid();
    })
});

submit.addEventListener('click', function (e) {
    e.preventDefault();
    checkAndSubmit();
    scrollToResult();
});

reset.addEventListener('click', function () {
    resetAll();
});

themeToggle.addEventListener('click', function () {
    toggleTheme();
})

priceSlider.addEventListener('change', function() {
    showPriceInput();
});

sliceSlider.addEventListener('change', function() {
    showSlicesInput()
});

inputSliders.forEach((slider) => {
    slider.addEventListener('change', function() {
        if (!isOutputPresent()) {
            checkAndSubmit();
        }
    });
});

//
// Returns
//
const isValid = () => {
    const areSizesValid = checkValues(pizza1.value, pizza2.value);
    const arePricesValid = priceSlider.checked ? checkValues(pizza1Price.value, pizza2Price.value) : true;
    const areSlicesValid = sliceSlider.checked ? checkValues(pizza1Slices.value, pizza2Slices.value) : true;
    let isValid = false;

    if (areSizesValid && arePricesValid && areSlicesValid) {
        isValid = true;
        submit.classList.remove('invalid');
    } else {
        submit.classList.add('invalid');
    }

    return isValid;
}

const isOutputPresent = () => {
    return output.innerHTML.trim() === "";
}

const calculateCircleArea = ((diameter = 0) => {
    const radius = diameter / 2;
    const radSquared = radius ** 2;
    const area = PI * radSquared;

    return area;
});

function generateSmallPizzaObject() {
    const pizzaOne = {
        size: Number(pizza1.value),
        area: calculateCircleArea(Number(pizza1.value)),
        price: Number(pizza1Price.value) || null,
        slices: Number(pizza1Slices.value) || null
    }
    const pizzaTwo = {
        size: Number(pizza2.value),
        area: calculateCircleArea(Number(pizza2.value)),
        price: Number(pizza2Price.value) || null,
        slices: Number(pizza2Slices.value) || null
    }

    if (pizzaOne.size < pizzaTwo.size) {
        pizzas.smallPizza = pizzaOne;
    } else {
        pizzas.smallPizza = pizzaTwo;
    }
}

function generateLargePizzaObject() {
    const pizzaOne = {
        size: Number(pizza1.value),
        area: calculateCircleArea(Number(pizza1.value)),
        price: Number(pizza1Price.value) || null,
        slices: Number(pizza1Slices.value) || null
    }
    const pizzaTwo = {
        size: Number(pizza2.value),
        area: calculateCircleArea(Number(pizza2.value)),
        price: Number(pizza2Price.value) || null,
        slices: Number(pizza2Slices.value) || null
    }

    if (pizzaOne.size > pizzaTwo.size) {
        pizzas.largePizza = pizzaOne;
    } else {
        pizzas.largePizza = pizzaTwo;
    }
}

const checkValues = (inputOne, inputTwo) => {
    const firstVal = Number(inputOne) || null;
    const secondVal = Number(inputTwo) || null;
    let isValid = false;

    if (firstVal && secondVal && firstVal > 0 && secondVal > 0) {
        isValid = true;

        error.innerHTML = '';
    } else if (firstVal && secondVal && (firstVal <= 0 || secondVal <= 0)) {
        error.innerHTML = 'Cannot enter values less than 0.';
    }

    return isValid;
}

const generateMathRow = () => {
    const { smallPizza, largePizza } = pizzas;
    const hideClass = mathSlider.checked ? '' : 'hide';

    if (smallPizza.PPSI && largePizza.PPSI) {
        html = `
            <div class='table-row' class='math-output ${hideClass}'>
                MATH
            </div>
        `;
    }

    return html
}

const generatePPSIRowText = () => {
    const { smallPizza, largePizza } = pizzas;
    let html = '';

    if (smallPizza.PPSI && largePizza.PPSI) {
        html = `
            <div class='table-row'>
                <div class='table-data'>Square Inch</div>
                <div class="table-data ${smallPizza.PPSI < largePizza.PPSI ? 'best-deal' : ''}">$${smallPizza.PPSI}</div>
                <div class="table-data ${largePizza.PPSI < smallPizza.PPSI ? 'best-deal' : ''}">$${largePizza.PPSI}</div>
            </div>
        `;
    }

    return html
}



const generatePPSRowText = () => {
    const { smallPizza, largePizza } = pizzas;
    let html = '';

    if (smallPizza.PPS && largePizza.PPS) {
        html = `
        <div class='table-row'>
            <div class='table-data'>Slice</div>
            <div class="table-data">$${smallPizza.PPS}</div>
            <div class="table-data">$${largePizza.PPS}</div>
        </div>
    `;
    }

    return html;
}

//
// Functions
//
function calculatePercentageDifference() {
    output.innerHTML = '';
    hydratePizzasObject();

    if (pizzas.totalPizzaDiff < 100) {
        generatePizzas();
    } else {
        pizzaOutput.innerHTML = "<h4>That's a lotta pizza!</h4>";
    }

    if (priceSlider.checked || sliceSlider.checked) {
        generatePizzaTable();
    }

    generatePizzaDiffText();
};

function hydratePizzasObject() {
    generateSmallPizzaObject();
    generateLargePizzaObject();
    pizzas.percentageDiff =  (100 - ((pizzas.smallPizza.area / pizzas.largePizza.area) * 100)).toFixed(2);
    pizzas.totalPizzaDiff = (pizzas.largePizza.area / pizzas.smallPizza.area).toFixed(2);

    if (priceSlider.checked) {
        pizzas.smallPizza.PPSI = (pizzas.smallPizza.price / pizzas.smallPizza.area).toFixed(2);
        pizzas.largePizza.PPSI = (pizzas.largePizza.price / pizzas.largePizza.area).toFixed(2);
    }

    if (sliceSlider.checked) {
        pizzas.smallPizza.PPS = (pizzas.smallPizza.price / pizzas.smallPizza.slices).toFixed(2);
        pizzas.largePizza.PPS = (pizzas.largePizza.price / pizzas.largePizza.slices).toFixed(2);
    }
}

function generatePizzaTable() {
    const { smallPizza, largePizza } = pizzas;
    const tableKey = `<div class='table-key'><div class='green-key'></div><div>Best value per dollar</div></div>`;
    const tableKeyHtml = priceSlider.checked ? tableKey : '';

    output.innerHTML += `
        <div class='output-wrap'>
            <div class="output-title">
                <h2>Price Information</h2>
            </div>
            <div class='table'>
                <div class='table-row'>
                    <div class='table-head'>Price Per</div>
                    <div class='table-head'>${smallPizza.size} Inch Pizza</div>
                    <div class='table-head'>${largePizza.size} Inch Pizza</div>
                </div class='table-row'>
                ${generatePPSIRowText()}
                ${generatePPSRowText()}
            </div>
            ${tableKeyHtml}
        </div>
    `
}

function checkAndSubmit() {
    if (isValid()) {
        calculatePercentageDifference();
        resetDiv.classList.remove('hide');
    }
}

function createPizzaDiv() {
    for (let i = 1; i < pizzas.totalPizzaDiff; i++) {
        pizzaOutput.innerHTML += `
            <div class='pizza' style="animation-delay: ${delay}ms"></div>
        `;

        delay += DELAYSPEED;
    }
}

const generatePercentageMathText = () => {
    const { smallPizza, largePizza } = pizzas;
    const hideClass = mathSlider.checked ? '' : 'hide';

    return `
        <math xmlns="http://www.w3.org/1998/Math/MathML" class='math-output ${hideClass}'>
            <mstyle displaystyle="true">
                <mn>100</mn>
                <mo>-</mo>
                <mrow>
                    <mo>(</mo>
                    <mrow>
                        <mo>(</mo>
                        <mfrac>
                            <msup class="small">
                                <mn>π (${smallPizza.size}/2)</mn>
                                <mn>2</mn>
                            </msup>
                            <msup class="large">
                                <mn>π (${largePizza.size}/2)</mn>
                                <mn>2</mn>
                            </msup>
                        </mfrac>
                        <mo>)</mo>
                    </mrow>
                    <mo>x</mo>
                    <mn>100</mn>
                    <mo>)</mo>
                    <mo>=</mo>
                    <mn class="percent">${pizzas.percentageDiff}%</mn>
                </mrow>
            </mstyle>
        </math>
    `;
}

const generateDifferenceMathText = () => {
    const { smallPizza, largePizza } = pizzas;
    const hideClass = mathSlider.checked ? '' : 'hide';

    return `
        <math xmlns="http://www.w3.org/1998/Math/MathML" class='math-output ${hideClass}'>
            <mstyle displaystyle="true">
                <mrow>
                    <mfrac>
                        <msup class="small">
                            <mn>π (${smallPizza.size}/2)</mn>
                            <mn>2</mn>
                        </msup>
                        <msup class="large">
                            <mn>π (${largePizza.size}/2)</mn>
                            <mn>2</mn>
                        </msup>
                    </mfrac>
                </mrow>
                <mo>=</mo>
                <mn class="total"">${pizzas.totalPizzaDiff}</mn>
            </mstyle>
        </math>
    `;
}

function generatePizzaDiffText() {
    const { smallPizza, largePizza } = pizzas;

    output.innerHTML += `
        <div class="output-wrap">
            <div class="output-title">
                <h2>Pizza Difference</h2>
            </div>
            <div class="output-text">
                <div class="output-row">
                    One
                    <span class='small'>${smallPizza.size}</span> inch pizza is
                    <span class='percent'>${pizzas.percentageDiff}%</span> smaller than one
                    <span class='large'>${largePizza.size}</span> inch pizza.
                    ${generatePercentageMathText()}
                </div>

                <div class="output-row">
                    It would take
                    <span class='total'>${pizzas.totalPizzaDiff}</span>
                    <span class='small'>${smallPizza.size}</span> inch pizzas to match one
                    <span class='large'>${largePizza.size}</span> inch pizza
                    ${generateDifferenceMathText()}
                </div>
            </div>
        <div>
    `;
}

function createLastPizzaDiv(lastPizzaDegrees) {
    const bgColor = isLightMode ? '#f1f1f1' : `rgb(40, 40, 40)`;
    delay += DELAYSPEED;

    if (lastPizzaDegrees !== 0) {
        const lastPizzaStyle = `background-image: conic-gradient(rgba(255, 255, 255, 0) ${lastPizzaDegrees}deg, ${bgColor} ${lastPizzaDegrees}deg), url('pizza.png');`;

        pizzaOutput.innerHTML += `
            <div class="pizza" style="${lastPizzaStyle} animation-delay: ${delay}ms"></div>
        `;
    } else {
        pizzaOutput.innerHTML += `
            <div class='pizza' style="animation-delay: ${delay}ms"></div>
        `;
    }
}

function resetAll() {
    resetter.forEach((element) => {
        element.value = '';
    })
    output.innerHTML = '';
    pizzaOutput.innerHTML = '';
    resetDiv.classList.add('hide');
    submit.classList.add('invalid');
    delay = 0;
    pizza1.focus();
    pizza1.select();
}

function showPriceInput() {
    const pricePerInchOutput = document.getElementById('pricePerInchOutput') || null;

    if (priceSlider.checked || sliceSlider.checked) {
        pizza1Price.parentNode.classList.remove('hide');
        pizza2Price.parentNode.classList.remove('hide');

        if (pricePerInchOutput) {
            pricePerInchOutput.classList.remove('hide');
        }
    } else {
        pizza1Price.parentNode.classList.add('hide');
        pizza2Price.parentNode.classList.add('hide');

        if (pricePerInchOutput) {
            pricePerInchOutput.classList.add('hide');
        }
    }
}

function showSlicesInput() {
    const pricePerSliceOutput = document.getElementById('pricePerSliceOutput') || null;

    if (sliceSlider.checked) {
        pizza1Slices.parentNode.classList.remove('hide');
        pizza2Slices.parentNode.classList.remove('hide');

        if (pricePerSliceOutput) {
            pricePerSliceOutput.classList.remove('hide');
        }
    } else {
        pizza1Slices.parentNode.classList.add('hide');
        pizza2Slices.parentNode.classList.add('hide');

        if (pricePerSliceOutput) {
            pricePerSliceOutput.classList.add('hide');
        }
    }

    showPriceInput();
}

async function generatePizzas() {
    pizzaOutput.innerHTML = '';
    const remainder = pizzas.totalPizzaDiff - Math.floor(pizzas.totalPizzaDiff);
    const lastPizzaDegrees = 360 * remainder;

    await createPizzaDiv();
    await createLastPizzaDiv(lastPizzaDegrees);

    delay = 0;
}

function scrollToResult() {
    output.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function toggleTheme() {
    isLightMode = themeToggle.checked;

    if (isLightMode) {
        localStorage.setItem('darkMode', 'false');
        document.body.classList.remove('dark-mode');
    } else {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
    }

    checkAndSubmit();
}

function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        addDarkTheme();
    } else {
        addLightTheme();
    }
};

function addDarkTheme() {
    isLightMode = false;
    themeToggle.checked = false;
    document.body.classList.add('dark-mode');
}

function addLightTheme() {
    themeToggle.checked = true;
    document.body.classList.remove('dark-mode');
}

function checkTheme() {
    if (localStorage.getItem('darkMode')) {
        if (localStorage.getItem('darkMode') === 'true') {
            addDarkTheme();
        } else {
            addLightTheme();
        }
    } else {
        getSystemTheme();
    }
}

checkTheme();