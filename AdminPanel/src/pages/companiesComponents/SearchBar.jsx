// SearchBar.js
import React from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search for a Company"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        endAdornment: (
          <>
            <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
              Search
            </Button>
            <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ ml: 1 }}>
              Filters
            </Button>
          </>
        ),
      }}
    />
  </Paper>
);

export default SearchBar;