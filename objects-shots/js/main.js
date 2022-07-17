const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
//input received from the user
const input = document.querySelector('input');
// Buttons
const submitBtn = document.querySelector('#submit-btn');
const buttons = Array.from(document.querySelectorAll('button'));
const nameOutput = document.querySelector('#name-output');
const ingredientSection = document.querySelector('.ingredients-section')
const ingredientsTitle = document.querySelector('.ingredients-title')
const instructionsTitle = document.querySelector('.instructions-title');
const instructionsOutput = document.querySelector('p');
const imgOutput = document.querySelector('img');
const carouselBtns = document.querySelector('.carousel');
const noInputFound = document.querySelector('.noInput');

// variables that store the api data + index values for DOM rendering
let drinkData;
let selectionActive = false;
let flaggedNoInput = false;
let drinkNames = [];
let drinkImages = [];
let drinkInstructions = [];
let ingrdientsList = [];
let drinkArrLength;
let index = 0;

input.addEventListener("keypress", event=>{
    if(event.key === 'Enter'){
        event.preventDefault();
        submitBtn.click();
    }
})

buttons.forEach(btn=> btn.addEventListener('click', e=>{

    if(e.target.id === 'submit-btn' && input.value === ''){
        noInput()
    } else if(e.target.id === 'submit-btn' && selectionActive === false){
        retriever(input.value);
    } else if (e.target.id === 'submit-btn' && selectionActive === true){
        resetAndSearch(input.value)
    } else if (e.target.id === 'nextCarousel' && selectionActive === true){
        next(drinkArrLength);
    } else if (e.target.id === 'prevCarousel' && selectionActive === true){
        prev(drinkArrLength);

    }
}))

function next(ttlNumOfDrinks){
    if(index < ttlNumOfDrinks){
        index++
        displayDrinkData(drinkNames, drinkImages, drinkInstructions, index)
    } else {
        index = 0;
        displayDrinkData(drinkNames, drinkImages, drinkInstructions, index)
    }
}

function prev(ttlNumOfDrinks){
    if(index > 0){
        index--
        displayDrinkData(drinkNames, drinkImages, drinkInstructions, index)
    } else {
        index = ttlNumOfDrinks;
        displayDrinkData(drinkNames, drinkImages, drinkInstructions, index)
    }
}

function resetAndSearch(newSelection){
    selectionActive = false;
    drinkNames = [];
    drinkImages = [];
    drinkInstructions = [];
    drinkArrLength = 0;
    index = 0;
    retriever(newSelection);
}

function nothingFoundInSearch(){
    noInputFound.innerText = 'No cocktails found'
    noInputFound.style.visibility = 'visible'
    flaggedNoInput = true;
}

function noInput(){
    flaggedNoInput = true;
    noInputFound.innerText = 'Please enter a cocktail name'
    noInputFound.style.visibility = 'visible';
}

function inputFound(){
    noInputFound.style.visibility = 'hidden';
    flaggedNoInput = false;
}


function retriever(selection){
    fetch(url + selection)
        .then(res=> res.json())
        .then (data=> {
            drinkData = data.drinks;
            if(drinkData == null) {
                return nothingFoundInSearch();
            } else{
                drinkArrLength = drinkData.length-1;
                drinkData.forEach(elem=> {
                    drinkNames.push(elem.strDrink)
                    drinkImages.push(elem.strDrinkThumb)
                    drinkInstructions.push(elem.strInstructions)
                });
            }
            displayDrinkData(drinkNames, drinkImages, drinkInstructions, index);
        })
        .catch(err=> {
            console.log(`Error: ${err}`)
        })
}

function ingredientReset(index){
    ingrdientsList = [];
    while (ingredientSection.hasChildNodes()) {
        ingredientSection.removeChild(ingredientSection.firstChild);
    }

    ingredientsRetriever(index);
}

function ingredientsRetriever(index){
    if(ingredientSection.children.length >0){
        ingredientReset(index)
    } else{
    let value = 1;
    let cocktailIngredient;
    let measure;
    while(cocktailIngredient !== null && cocktailIngredient !== ''){
            measure = drinkData[index][`strMeasure${value}`];
            cocktailIngredient = drinkData[index][`strIngredient${value}`];
            if(measure !== null && measure !== ''){
                ingrdientsList.push(`${measure} :   ${cocktailIngredient}`)
                value++;
            } else if (cocktailIngredient !== null || cocktailIngredient === ''){
            console.log(measure)
            cocktailIngredient = drinkData[index][`strIngredient${value}`];
            ingrdientsList.push(cocktailIngredient)
            value++;
            } 
    }
    ingredientsDisplay();
  }
}

function ingredientsDisplay(){
    ingrdientsList.forEach(ingredient=> {
        let substance = document.createElement('li')
        let item = document.createTextNode(ingredient)
        substance.appendChild(item)
        ingredientSection.appendChild(substance)
    })
}

function displayDrinkData(drinkName, drinkImage, drinkInstructions, index=0) {
    if(flaggedNoInput === true){
        inputFound();
    }
    let i = index;
    selectionActive = true;
    nameOutput.innerText = drinkName[i];
    imgOutput.src = drinkImage[i];
    carouselBtns.style.visibility = 'visible';
    ingredientsTitle.innerText = 'Ingredients: ';
    instructionsTitle.innerText = 'Instructions: ';
    instructionsOutput.innerText = drinkInstructions[i];
    ingredientsRetriever(index)
}
