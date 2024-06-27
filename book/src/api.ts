import axios from 'axios';
import.meta.env
const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL as string || 'http://localhost:8000/api/books',
});

api.get('/books')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

api.post('/books', { title: 'New Book', author: 'Author', year: 2021 })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

api.put('/books/1', { title: 'Updated Book', author: 'Updated Author', year: 2022 })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

api.delete('/books/1')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

export default api;
