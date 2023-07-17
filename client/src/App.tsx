import moment from 'moment';
import { Route, Routes } from 'react-router-dom';
import Conversation from './components/Conversation';
import EmptyConversation from './components/EmptyConversation';
import useAuthCheck from './hooks/useAuthCheck';
import Chat from './pages/Chat';
import GoogleOauth from './pages/GoogleOauth';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Settings from './pages/Settings';
import EmptyRoute from './routes/EmptyRoute';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
    const authChecked = useAuthCheck();

    if (!authChecked) return null;

    moment.updateLocale('en', {
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'A seconds',
            ss: '%d seconds',
            m: 'A minute',
            mm: '%d minutes',
            h: 'An hour',
            hh: '%d hours',
            d: 'A day',
            dd: '%d days',
            M: 'A month',
            MM: '%d months',
            y: 'A year',
            yy: '%d years',
        },
    });

    return (
        <Routes>
            <Route path="" element={<PrivateRoute />}>
                <Route path="/settings" element={<Settings />} />
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
