import React from 'react';
import { Helmet } from 'react-helmet-async';
import ChangePassword from '../components/Settings/ChangePassword';
import Personal from '../components/Settings/Personal';

const Settings: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Settings | Chat App</title>
            </Helmet>

            <div className="flex flex-col items-center py-3 px-4 gap-8">
                <Personal />

                <ChangePassword />
            </div>
        </>
    );
};

export default Settings;
