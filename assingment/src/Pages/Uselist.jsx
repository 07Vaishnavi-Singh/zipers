import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, TablePagination } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getFirestore, collection, query, orderBy, limit, where, getDocs, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from "../Components/Firebase"


firebase.initializeApp(firebaseConfig);
const SearchBox = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& > *': {
        marginRight: theme.spacing(1),
    },
}));

const UserTable = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const db = getFirestore();

                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setPage(0);
    };

    const filteredUsers = users?.filter((user) => (
        user.name?.toLowerCase().includes(query.toLowerCase()) ||
        user.email?.toLowerCase().includes(query.toLowerCase()) ||
        user.country?.toLowerCase().includes(query.toLowerCase())
    ));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pagedUsers = filteredUsers?.slice(startIndex, endIndex);

    return (
        <Box>
            <SearchBox>
                <TextField
                    label="Search"
                    value={query}
                    onChange={handleSearch}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
            </SearchBox>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Followers</TableCell>
                            <TableCell>Friends</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Last Active</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {error && (
                            <TableRow>
                                <TableCell colSpan={7}>Error: {error.message}</TableCell>
                            </TableRow>
                        )}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={7}>Loading...</TableCell>
                            </TableRow>
                        )}
                        {pagedUsers && pagedUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.displayName}</TableCell>
                                <TableCell>{user.followers}</TableCell>
                                <TableCell>{user.friends}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>{user.country}</TableCell>
                                <TableCell>{user.lastLogin.seconds}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredUsers?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default UserTable;
