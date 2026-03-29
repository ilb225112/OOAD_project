import {Outlet} from 'react-router-dom'
import Navigation from './pages/Navigation'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/ReactToastify.css'

function App() {   
    return(
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Navigation/>
            <main>    
                <Outlet/>
            </main>
        </div>
    )
}

export default App
