let currentPage = 1;
let booksPerPage = 6;
let currentCategory = '';
let currentQuery = '';
let totalPages = 1;

function searchBooks(query, category = '', page = 1) {
    const startIndex = (page - 1) * booksPerPage;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}${category ? `+subject:${category}` : ''}&startIndex=${startIndex}&maxResults=${booksPerPage}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const books = data.items;
            let output = '';

            if (books) {
                books.forEach(book => {
                    const bookInfo = book.volumeInfo;
                    output += `
                        <div class="book">
                            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '/api/placeholder/300/200'}" alt="Book cover">
                            <h2>${bookInfo.title}</h2>
                            <p>Author: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'No Author'}</p>
                            <p>Published Date: ${bookInfo.publishedDate || 'Unknown'}</p>
                            <p>${bookInfo.description ? bookInfo.description.substring(0, 100) + '...' : 'No description available'}</p>
                        </div>
                    `;
                });

                totalPages = Math.ceil(data.totalItems / booksPerPage);
                document.getElementById('bookContainer').innerHTML = output;

                // Show pagination only after search/category selection
                document.querySelector('.pagination').style.display = 'block';
                updatePaginationButtons();
            } else {
                document.getElementById('bookContainer').innerHTML = '<p>No books found.</p>';
                document.querySelector('.pagination').style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching the books:', error));
}

function updatePaginationButtons() {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

document.getElementById('search-button').addEventListener('click', function() {
    currentQuery = document.getElementById('search-input').value;
    currentCategory = '';
    currentPage = 1;
    searchBooks(currentQuery, '', currentPage);
});

const categories = document.querySelectorAll('.category');
categories.forEach(category => {
    category.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            document.getElementById('bookContainer').innerHTML = '';
            document.querySelector('.pagination').style.display = 'none';
        } else {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            currentQuery = '';
            currentPage = 1;
            searchBooks('', currentCategory, currentPage);
        }
    });
});

document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        searchBooks(currentQuery, currentCategory, currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    if (currentPage < totalPages) {
        currentPage++;
        searchBooks(currentQuery, currentCategory, currentPage);
    }
});

// Initially hide pagination until search or category selection
document.querySelector('.pagination').style.display = 'none';