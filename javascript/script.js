document.addEventListener('DOMContentLoaded', function () {
    const formBook = document.getElementById('form-book')
    const inputJudul = document.getElementById('input-judul')
    const inputPenulis = document.getElementById('input-penulis')
    const inputTahun = document.getElementById('input-tahun')
    const inputBaca = document.getElementById('input-baca')
    const btnSearch = document.getElementById('btn-search')
    const inputSearch = document.getElementById('input-search')
    const RENDER_LIST = 'render-list'
    const KEY_STORAGE = 'key-storage'

    let books = []

    function isStorageExist(){
        if (typeof (Storage) === undefined) {
          alert('Browser kamu tidak mendukung local storage');
          return false;
        }
        return true;
    }

    function getBooksFromStorage(render) {
        if (isStorageExist()) {
            const booksFromStorage = localStorage.getItem(KEY_STORAGE)
            const parsing = JSON.parse(booksFromStorage)
            books = []
            if (parsing !== null) {
                for (const book of parsing) {
                    books.push(book)
                }
            }

            if (render) {
                document.dispatchEvent(new Event(RENDER_LIST))
            }
        }
    }

    function generateId() {
        return +new Date()
    }

    function bookObject(title, author, year, statusRead) {
        const id = generateId()
        return { id, title, author, year, statusRead }
    }

    function checkBook(id) {
        const book = books.find(book => book.id === id)

        if (book) {
            return true
        } else {
            return false
        }
    }

    function saveToStorage() {
        localStorage.setItem(KEY_STORAGE, JSON.stringify(books))
    }

    function deleteBook(id) {
        if (!checkBook(id)) return
        getBooksFromStorage(false)
        const index = books.findIndex(book => book.id === id)
        books.splice(index, 1)

        saveToStorage()
        document.dispatchEvent(new Event(RENDER_LIST))
    }

    function changeStatusRead(id) {
        if(!checkBook(id)) return 
        getBooksFromStorage(false)

        for (const book of books) {
            if (book.id == id) {
                book.statusRead = book.statusRead ? false : true
            }
        }

        saveToStorage()
        document.dispatchEvent(new Event(RENDER_LIST))
    }

    function componentBookItem({ id, title, author, year, statusRead }) {
        const titleBook = document.createElement('h2')
        titleBook.innerText = title

        const creatorBook = document.createElement('p')
        creatorBook.innerText = `Penulis : ${author}.`

        const yearBook = document.createElement('p')
        yearBook.innerText = `Tahun : ${year}.`

        const buttonStatusRead = document.createElement('button')
        buttonStatusRead.classList.add('btn-change-status')
        buttonStatusRead.addEventListener('click', () => { changeStatusRead(id) })
        buttonStatusRead.innerText = statusRead ? 'Pindah Belum dibaca' : 'Pindah Sudah dibaca'

        const buttonDelete = document.createElement('button')
        buttonDelete.classList.add('btn-delete')
        buttonDelete.addEventListener('click', ()=>{ deleteBook(id) })
        buttonDelete.innerText = 'Hapus Buku'

        const containerButton = document.createElement('div')
        containerButton.append(buttonStatusRead, buttonDelete)

        const container = document.createElement('div')
        container.setAttribute('id', `bookId-${id}`)
        container.classList.add('book-item')
        container.append(titleBook, creatorBook, yearBook, containerButton)

        return container
    }

    document.addEventListener(RENDER_LIST, function () {
        const finishedReadBook = document.getElementById('finished-read-book')
        finishedReadBook.innerHTML = ''

        const unreadBook = document.getElementById('unread-book')
        unreadBook.innerHTML = ''

        for (const book of books) {
            const componentBook = componentBookItem(book)
            if (book.statusRead) {
                finishedReadBook.append(componentBook)
            } else {
                unreadBook.append(componentBook)
            }
        }
    })

    btnSearch.addEventListener('click', function() {
        const booksFromStorage = localStorage.getItem(KEY_STORAGE)
        const parsingDataBooks = JSON.parse(booksFromStorage)
        books = []

        if (!inputSearch.value) {
            for (let book of parsingDataBooks) {
                books.push(book)
            }
        } else{
            const bookFromSearch = parsingDataBooks.filter(book => book.title == inputSearch.value)
            for (let book of bookFromSearch) {
                books.push(book)
            }
        }
        document.dispatchEvent(new Event(RENDER_LIST))
    })

    formBook.addEventListener('submit', function (e) {
        e.preventDefault()
        getBooksFromStorage(false)
        const newBook = bookObject(inputJudul.value, inputPenulis.value, inputTahun.value, inputBaca.checked);
        console.log(newBook);
        books.push(newBook)
        e.target.reset()

        saveToStorage()
        document.dispatchEvent(new Event(RENDER_LIST))
    })

    getBooksFromStorage(true)
})