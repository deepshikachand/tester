import { AppBar, Box, Container, Link as MLink, Toolbar, Typography } from "@mui/material";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ShortenerPage } from "./ShortenerPage";
import { StatsPage } from "./StatsPage";

export function App() {
	return (
		<BrowserRouter>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						URL Shortener
					</Typography>
					<MLink component={Link} to="/" color="inherit" underline="none" sx={{ mr: 2 }}>
						Shorten
					</MLink>
					<MLink component={Link} to="/stats" color="inherit" underline="none">
						Stats
					</MLink>
				</Toolbar>
			</AppBar>
			<Box component="main" sx={{ py: 3 }}>
				<Container maxWidth="md">
					<Routes>
						<Route path="/" element={<ShortenerPage />} />
						<Route path="/stats" element={<StatsPage />} />
					</Routes>
				</Container>
			</Box>
		</BrowserRouter>
	);
} 