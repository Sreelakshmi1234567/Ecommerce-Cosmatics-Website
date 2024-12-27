import { Routes, Route, BrowserRouter } from 'react-router-dom';

import AdminPage from './components/AdminPage';
import AdminLogin from './components/AdminLogin';
import Nykaadmin from './Adminbrands/Nykaadmin';
import Maybellineadmin from './Adminbrands/Maybellineadmin';
import Macadmin from './Adminbrands/Macadmin';
import Lorealadmin from './Adminbrands/Lorealadmin';
import Lakmeadmin from './Adminbrands/Lakmeadmin';
import Kayadmin from './Adminbrands/Kayadmin';
import Hudaadmin from './Adminbrands/Hudaadmin';
import Colorbaradmin from './Adminbrands/Colorbaradmin';
import AdminUsers from './components/AdminUsers';
import AdminOrders from './components/AdminOrders';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'element={<AdminLogin/>}/>
       <Route path='admin'element={<AdminPage/>}/>
    </Routes>
    <Routes>
      <Route path='/admin/brands/nykaa'element={<Nykaadmin/>}/>
      <Route path='/admin/brands/maybelline'element={<Maybellineadmin/>}/>
      <Route path='/admin/brands/mac'element={<Macadmin/>}/>
      <Route path='/admin/brands/loreal'element={<Lorealadmin/>}/>
      <Route path='/admin/brands/lakme'element={<Lakmeadmin/>}/>
      <Route path='/admin/brands/kay'element={<Kayadmin/>}/>
      <Route path='/admin/brands/huda'element={<Hudaadmin/>}/>
      <Route path='/admin/brands/colorbar'element={<Colorbaradmin/>}/>
    </Routes>
    <Routes>
      <Route path='/AdminUsers'element={<AdminUsers/>}/>
      <Route path='/AdminOrders'element={<AdminOrders/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
