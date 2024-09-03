// SearchBar.js
import React from 'react';
import { TextField, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for a Student"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />,
        }}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ whiteSpace: 'nowrap' }}>
        Search
      </Button>
      <Button variant="contained" startIcon={<FilterListIcon />} sx={{ whiteSpace: 'nowrap' }}>
        Filters
      </Button>
    </Box>
  );
};

export default SearchBar;
