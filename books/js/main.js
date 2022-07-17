const searchBar = document.querySelector('input');
const submitBtn = document.querySelector('button');
const title = document.querySelector('#title')
title.innerText = localStorage.getItem('books')
submitBtn.addEventListener('click', ISBNFetcher)


function ISBNFetcher(){
    const choice = searchBar.value;
    const url = `https://openlibrary.org/isbn/${choice}.json`
    fetch(url)
        .then(res=> res.json())
        .then(data=> {
            console.log(data, choice.length)
            if(data.title === undefined){
                document.querySelector('#nothingFound').innerText = 'ISBN not found'
                return;
            } else if (localStorage.getItem('books')){
                // localStorage.setItem('books', data.title)
                let books = localStorage.getItem('books') + ', ' + data.title;
                localStorage.setItem('books', books)
                console.log(books)
            } else {
                localStorage.setItem('books', data.title)
            }
            title.innerText = localStorage.getItem('books');
        })
        .catch(err=> {
            console.log(`Error: ${err}`)
        })
}
