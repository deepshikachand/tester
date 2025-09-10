import { useState } from "react";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { apiClient } from "../utils/apiClient";

interface Row {
	url: string;
	validity: string;
	shortcode: string;
}

const emptyRow = (): Row => ({ url: "", validity: "30", shortcode: "" });

export function ShortenerPage() {
	const [rows, setRows] = useState<Row[]>([emptyRow()]);
	const [results, setResults] = useState<any[]>([]);
	const [error, setError] = useState<string | null>(null);

	const addRow = () => setRows((r) => (r.length < 5 ? [...r, emptyRow()] : r));

	const onChange = (idx: number, key: keyof Row, value: string) => {
		setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
	};

	const submit = async () => {
		setError(null);
		const payloads = rows
			.filter((r) => r.url.trim())
			.map((r) => ({ url: r.url.trim(), validity: Number(r.validity || 30), shortcode: r.shortcode.trim() || undefined }));
		if (payloads.length === 0) return;
		const created: any[] = [];
		for (const p of payloads) {
			const res = await apiClient.createShortUrl(p);
			if (res) created.push(res);
		}
		setResults(created);
		if (created.length === 0) {
			setError(
				"No links created. Is your backend running? Set VITE_API_BASE_URL in .env to your API host (e.g., http://localhost:8080).",
			);
		}
	};

	return (
		<Box>
			<Typography variant="h5" gutterBottom>
				Create Short URLs (max 5)
			</Typography>
			<Paper sx={{ p: 2, mb: 3 }}>
				{rows.map((row, i) => (
					<Grid container spacing={2} key={i} sx={{ mb: 1 }}>
						<Grid item xs={12} md={7}>
							<TextField fullWidth label="Original URL" value={row.url} onChange={(e) => onChange(i, "url", e.target.value)} />
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField fullWidth label="Validity (min)" value={row.validity} onChange={(e) => onChange(i, "validity", e.target.value)} />
						</Grid>
						<Grid item xs={6} md={2}>
							<TextField fullWidth label="Shortcode (opt)" value={row.shortcode} onChange={(e) => onChange(i, "shortcode", e.target.value)} />
						</Grid>
					</Grid>
				))}
				<Box sx={{ display: "flex", gap: 1 }}>
					<Button variant="outlined" onClick={addRow} disabled={rows.length >= 5}>
						Add Row
					</Button>
					<Button variant="contained" onClick={submit}>
						Shorten
					</Button>
				</Box>
				{error && (
					<Typography color="error" sx={{ mt: 1 }}>
						{error}
					</Typography>
				)}
			</Paper>
			{results.length > 0 && (
				<Box>
					<Typography variant="h6">Results</Typography>
					{results.map((r, i) => (
						<Box key={i} sx={{ my: 1 }}>
							<Typography variant="body2">Short Link: {r.shortLink}</Typography>
							<Typography variant="body2">Expiry: {r.expiry}</Typography>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
} 