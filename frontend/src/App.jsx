// import './App.css'
// import TodoApp from './components/TodoApp'

// '<h1>${nombre}</h1>'
// <></> | Fragment

// Pasar Props
// function App() {
//   const  notas = [
//     {
//       id: crypto.randomUUID(),
//       text: "Soy la nota 1",
//     },
//     {
//       id: crypto.randomUUID(),
//       text: "Soy la nota 2",
//     },
//   ];          
//   return (
//     <section className='containerTodoApp'>
//       <TodoApp notas = {notas}> </TodoApp>
//     </section>
//   );
// }

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginV from './views/LoginV';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginV />} />
        <Route path="/login" element={<LoginV />} />
      </Routes>
    </BrowserRouter>
  );
}