import { Route, Routes } from 'react-router-dom';
import Conversation from './components/Conversation';
import EmptyConversation from './components/EmptyConversation';
import useAuthCheck from './hooks/useAuthCheck';
import Chat from './pages/Chat';
import GoogleOauth from './pages/GoogleOauth';
import Login from './pages/Login';
import Registration from './pages/Registration';
import EmptyRoute from './routes/EmptyRoute';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
    const authChecked = useAuthCheck();

    if (!authChecked) return null;

    return (
        <Routes>
            <Route path="" element={<PrivateRoute />}>
                <Route path="/" element={<Chat />}>
                    <Route index element={<EmptyConversation />} />
                    <Route
                        path="/t/:conversationId"
                        element={<Conversation />}
                    />
                </Route>
            </Route>
            <Route path="" element={<PublicRoute />}>
                <Route path="/login/:jwt/:user" element={<GoogleOauth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Registration />} />
            </Route>
            <Route path="*" element={<EmptyRoute />} />
        </Routes>
    );
}

export default App;
