const baseURL = "https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b";
let booklist = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 6;

window.onload = () => {
    const fetchButton = document.getElementById("fetchButton");
    const filterInput = document.getElementById("filterInput");
    const pagination = document.getElementById("pagination");
    const loading = document.getElementById("loading");

    fetchButton.addEventListener('click', async () => {
        loading.style.display = "block";
        filterInput.classList.add("hidden");
        pagination.classList.add("hidden");

        try {
            const res = await fetch(baseURL);
            const data = await res.json();
            booklist = data.results.books;
            filteredBooks = booklist; // Initially, all books are shown
            loading.style.display = "none";

            // Show filter and pagination controls
            filterInput.classList.remove("hidden");
            pagination.classList.remove("hidden");

            renderBooks();
        } catch (err) {
            console.error("Failed to fetch books: ", err);
            loading.textContent = "Failed to load books. Please try again.";
        }
    });

    filterInput.addEventListener('input', () => {
        filterBooks(filterInput.value);
        currentPage = 1; // Reset to the first page when filtering
        renderBooks();
    });

    document.getElementById("prevPage").addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks();
        }
    });

    document.getElementById("nextPage").addEventListener('click', () => {
        if (currentPage * booksPerPage < filteredBooks.length) {
            currentPage++;
            renderBooks();
        }
    });
};

function renderBooks() {
    const booklistElement = document.getElementById("booklist");
    booklistElement.innerHTML = "";

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = filteredBooks.slice(start, end);

    paginatedBooks.forEach(book => {
        const newBook = document.createElement('div');
        newBook.className = "single-book p-4 bg-white rounded-lg shadow-md flex flex-col items-center";

        const bookImg = document.createElement('img');
        bookImg.src = book.book_image;
        bookImg.className = "book-image w-33 h-49 mb-4 object-cover rounded";

        const bookInfo = document.createElement('div');
        bookInfo.className = "book-info text-center";

        const title = document.createElement('div');
        title.className = "book-title font-semibold text-lg";
        title.innerHTML = book.title;

        const author = document.createElement('div');
        author.className = "book-author text-gray-500 mb-2";
        author.innerHTML = book.author;

        const desc = document.createElement('div');
        desc.className = "book-desc text-gray-700 text-sm";
        desc.innerHTML = book.description;

        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(desc);
        newBook.appendChild(bookImg);
        newBook.appendChild(bookInfo);
        booklistElement.appendChild(newBook);
    });

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
}

function filterBooks(query) {
    filteredBooks = booklist.filter(book => {
        return book.title.toLowerCase().includes(query.toLowerCase()) ||
               book.author.toLowerCase().includes(query.toLowerCase());
    });
}
