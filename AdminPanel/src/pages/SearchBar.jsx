import React, { useState } from 'react';
import './SearchBar.css'; // Ensure this path is correct

const SearchBar = ({ handleSearch, handleFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for a Student"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => handleSearch(searchTerm)}>Search</button>
            <button onClick={handleFilter}>Add Filters</button>
        </div>
    );
};

export default SearchBar;

