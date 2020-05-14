//book class:Represents a book
class Book{
    constructor(title,author,isbn){
this.title=title;
this.author=author;
this.isbn=isbn;
    }
}

//UI class handle ui tasks

class UI{
    static displayBooks(){
      
    const books=Store.getBooks();

    books.forEach((book)=> UI.addBookToList(book));

    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row=document.createElement('tr');

        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }//we want to second parent element of <a> <td><tr>
static deleteBook(el){
    if (el.classList.contains('delete')) {
        el.parentElement.parentElement.parentElement.remove();
    }
}


    static showAlert(message,className){
const div=document.createElement('div');
div.className=`alert alert-${className}`;

const container=document.querySelector('.container');
const form=document.querySelector('#book-form');
container.insertBefore(div,form);

//Vanish in 3 seconds
setTimeout(()=>document.querySelector('.alert').remove(),3000);

        div.appendChild(document.createTextNode(message));
    }

    static clearFields(){
        document.querySelector('#title').value=document.querySelector('#author').value=document.querySelector('#isbn').value='';
    }
}

//Store class: Handles storage
class Store{
    static getBooks(){
        let books;
        if (localStorage.getItem('books')===null) {
            books=[];
        }else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books=Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){
        const books=Store.getBooks();
        books.forEach((book,index)=>{
            if (book.isbn===isbn) {
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }
}


//Event:Display books

document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event Add a Book

document.getElementById("book-form").addEventListener('submit',(e)=>{

    //prevent actual submit
    e.preventDefault();

    //Get form values
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    //Validate
    if (title==='' || author===''||isbn==='') {
        UI.showAlert('please fill fields','danger');
    }
    else{

        //Instantiate book
    const book=new Book(title,author,isbn);


    //add book to ui
    UI.addBookToList(book);
    //Add book to store
Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added','success');


    // console.log(book);


    //Clear fields
    UI.clearFields();
    }


    

})

//Event Remove a Book
document.querySelector('#book-list').addEventListener('click',(e)=>{



    // console.log(e.target);
    UI.deleteBook(e.target);

    //Remove book from store parent element is <td>
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book removed','success');
})