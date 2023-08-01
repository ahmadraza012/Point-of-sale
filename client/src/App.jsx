import 'antd/dist/reset.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Homepage from './pages/Homepage'
import ItemsPage from './pages/ItemsPage'
import CartPage from './pages/CartPage'
import Login from './components/Login'
import Signup from './components/Signup'
import BillsPage from './pages/BillsPage'
import CustomersPage from './pages/CustomersPage'
function App() {

  return (
    <>
      <BrowserRouter>
       <Routes>
        <Route path='/' element={
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
        } />
        <Route path='/items' element={
       <ProtectedRoute>
         <ItemsPage />
       </ProtectedRoute>
      } />
        <Route path='/cart' element={
       <ProtectedRoute>
         <CartPage />
       </ProtectedRoute>
      } />
        <Route path='/bills' element={
       <ProtectedRoute>
         <BillsPage />
       </ProtectedRoute>
      } />
        <Route path='/customers' element={
       <ProtectedRoute>
         <CustomersPage />
       </ProtectedRoute>
      } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
       </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

export function ProtectedRoute({ children }){
  if(localStorage.getItem("auth")){
    return children
  } else {
    return <Navigate to="/login" />
  }
}
