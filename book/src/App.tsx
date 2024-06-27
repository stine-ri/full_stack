import React, { useRef, useReducer, useEffect, useState, useCallback, FC } from 'react';
import api from './api'; // Import the Axios instance
import.meta.env
import './App.css';

interface Book {
  title: string;
  author: string;
  year: string;
}

interface Action {
  type: 'ADD_BOOK' | 'DELETE_BOOK' | 'EDIT_BOOK' | 'SET_BOOKS';
  payload: any;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

const reducer = (state: Book[], action: Action): Book[] => {
  switch (action.type) {
    case 'ADD_BOOK':
      return [...state, action.payload];
    case 'DELETE_BOOK':
      return state.filter((_, index) => index !== action.payload);
    case 'EDIT_BOOK':
      return state.map((book, index) => index === action.payload.index ? action.payload.book : book);
    case 'SET_BOOKS':
      return action.payload;
    default:
      return state;
  }
};

const App: FC = () => {
  const [storedBooks, setStoredBooks] = useLocalStorage<Book[]>('books', []);
  const [state, dispatch] = useReducer(reducer, storedBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const booksPerPage = 5;

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStoredBooks(state);
  }, [state, setStoredBooks]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('http://localhost:8000/api/books'); 
        dispatch({ type: 'SET_BOOKS', payload: response.data });
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddBook = async (book: Book) => {
    try {
      const response = await api.post('http://localhost:8000/api/books', book); 
      dispatch({ type: 'ADD_BOOK', payload: response.data });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (index: number) => {
    try {
      const book = state[index];
      await api.delete(`http://localhost:8000/api/books/${book.title}`); 
      dispatch({ type: 'DELETE_BOOK', payload: index });
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleEditBook = async (index: number, book: Book) => {
    try {
      await api.put(`http://localhost:8000/api/books/${book.title}`, book); 
      dispatch({ type: 'EDIT_BOOK', payload: { index, book } });
    } catch (error) {
      console.error('Error editing book:', error);
    }
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleRef.current && authorRef.current && yearRef.current) {
      const newBook: Book = {
        title: titleRef.current.value,
        author: authorRef.current.value,
        year: yearRef.current.value,
      };
      handleAddBook(newBook);
      titleRef.current.value = '';
      authorRef.current.value = '';
      yearRef.current.value = '';
    }
  };

  const filteredBooks = state.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = useCallback((pageNumber: number) => setCurrentPage(pageNumber), []);

  return (
    <div className="container">
      <h1>Book Repository</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" ref={titleRef} required />
        <input type="text" placeholder="Author" ref={authorRef} required />
        <input type="number" placeholder="Publication Year" ref={yearRef} required />
        <button type="submit">Add Book</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>
                <button onClick={() => {
                  const title = prompt("New title:", book.title);
                  const author = prompt("New author:", book.author);
                  const year = prompt("New publication year:", book.year);
                  if (title && author && year) {
                    handleEditBook(index, { title, author, year });
                  }
                }}>Edit</button>
                <button onClick={() => handleDeleteBook(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li>
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : currentPage)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, i) => i + 1).map(number => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => paginate(currentPage < Math.ceil(filteredBooks.length / booksPerPage) ? currentPage + 1 : currentPage)}
              disabled={currentPage === Math.ceil(filteredBooks.length / booksPerPage)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default App;
