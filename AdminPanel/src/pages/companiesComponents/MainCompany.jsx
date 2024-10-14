// MainCompany.jsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useParams, useNavigate , useLocation} from 'react-router-dom';

import PlacedStudentsTable from './PlacedStudentsTable.jsx';
import CompanyRoundTable from './CompanyRoundTable.jsx';
import RoundWiseStudent from './RoundWiseStudent.jsx';
import ManageStudents from './ManageStudents.jsx';
import "/node_modules/primeflex/primeflex.css";

const MainCompany = () => {

    const [activeTable, setActiveTable] = useState(null); // to render different table according to buttons
    const { companyId } = useParams(); // Get companyId from the URL
    const location = useLocation(); // Get location object
    const queryParams = new URLSearchParams(location.search);
    const companyName = queryParams.get('companyName'); // Extract companyName from query params

    const renderTable = () => {
        switch (activeTable) {
            case 'placedStudentsTable':
                return <PlacedStudentsTable companyId={companyId} />;
            case 'companyRoundTable':
                return <CompanyRoundTable companyId={companyId}/>;
            case 'roundWiseStudent':
                return <RoundWiseStudent companyId={companyId}/>;
            case 'manageStudents':
                return <ManageStudents companyId={companyId}/>;
            default:
                return null;
        }
    };


    const navigate = useNavigate();
    // to navigate to previous page
    const handleBack = () => {
        navigate(-1);
    }


    return (
        <div>
            <header className="flex align-items-center border-2 w-full border-round">
                <Button 
                    onClick={handleBack}
                    className="p-button-primary m-3 border-round"
                    label="Back"
                    icon="pi pi-arrow-left"
                    size="small"
                />
                <h1 className="mx-auto">{companyName} </h1>
            </header>
            <div className="flex flex-row md:justify-content-start">
                <Button label="Placed Students" size='small'
                className='mr-2' onClick={() => setActiveTable('placedStudentsTable')} />
                <Button label="Manage Rounds" size='small'
                className='mr-2' onClick={() => setActiveTable('companyRoundTable')}/>
                <Button label="View Students" size='small'
                className='mr-2' onClick={() => setActiveTable('roundWiseStudent')}/>
                <Button label="Manage Students" size='small'
                className='mr-2' onClick={() => setActiveTable('manageStudents')}/>
            </div>
            <div>
                {activeTable === null ? <p>Select a table to view data.</p> : renderTable()}
            </div>
        </div>
    );
};

export default MainCompany;
