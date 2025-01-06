import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Divider,
    Typography,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home,
    ShowChart,
    Assessment,
    BusinessCenter,
    Settings,
    Info,
    Analytics,
    Search,
    Login,
    Dashboard,
} from "@mui/icons-material";

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const findTickerFromName = async (name:any) => {

        // return name
        const url = `https://localhost:8000/ticker?name=${name}`;


        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.ticker) {
                return data.ticker;
            } else {
                throw new Error('No results found');
            }
        } catch (error) {
            console.error('Error fetching ticker:', error);
            alert('Could not find a ticker for the given name. Please try again.');
            return null;
        }
    };

    const handleSearch = async (event: any) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            alert("Please enter a company name.");
            return;
        }

        setLoading(true);
        const ticker = await findTickerFromName(searchQuery);
        setLoading(false);

        if (ticker) {
            navigate(`/${ticker}`);
        }
    };

    const menuItems = [
        { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
        {
            text: "Sector Analysis",
            icon: <Analytics />,
            path: "/sector",
            description: "Analyze different sectors",
        },
        {
            text: "Calculator",
            icon: <Assessment />,
            path: "/calculator",
            description: "Calculate ESG scores",
        },
        {
            text: "Login",
            icon: <Login />,
            path: "/login",
            description: "User login",
        },
        { text: "Settings", icon: <Settings />, path: "/settings" },
        { text: "About", icon: <Info />, path: "/about" },
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <nav className="bg-slate-800 p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleSidebar}
                            sx={{ mr: 2, color: "white" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <h1 className="text-white font-bold text-xl">Green Finance Analyser</h1>
                    </div>
                    <form className="flex items-center space-x-2" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search for a company"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-white ${
                                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>
                </div>
            </nav>

            <Drawer
                anchor="left"
                open={sidebarOpen}
                onClose={toggleSidebar}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 280,
                        boxSizing: "border-box",
                        backgroundColor: "#1e293b",
                        color: "white",
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <h2 className="text-xl font-bold text-white">Menu</h2>
                        <IconButton onClick={toggleSidebar} sx={{ color: "white" }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                </Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            onClick={() => {
                                navigate(item.path);
                                toggleSidebar();
                            }}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                },
                                mb: 1,
                                cursor: "pointer",
                            }}
                        >
                            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    "& .MuiListItemText-primary": {
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                        color: "white",
                                    },
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        p: 2,
                        backgroundColor: "#1e293b",
                    }}
                >
                    <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)", mb: 2 }} />
                    <Box sx={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
                        <Typography variant="body2">Green Finance Analyser v1.0</Typography>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default NavBar;
