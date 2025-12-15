const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Helper to perform Google Search via DuckDuckGo (HTML version)
async function searchWeb(query) {
    try {
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' tourism india travel guide')}`;

        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 4000
        });

        const $ = cheerio.load(data);
        const results = [];

        $('.result__body').each((i, el) => {
            if (results.length >= 3) return;

            const title = $(el).find('.result__a').text().trim();
            const link = $(el).find('.result__a').attr('href');
            const snippet = $(el).find('.result__snippet').text().trim();

            const badPatterns = [
                'duckduckgo.com/y',
                'tripadvisor',
                'facebook.com',
                'instagram.com',
                'twitter.com',
                'youtube.com',
                'makemytrip.com',
                'goibibo.com',
                'ads',
                'tracker'
            ];

            const isBad = !link || !title || !link.startsWith('http') || badPatterns.some(p => link.toLowerCase().includes(p));

            if (!isBad) {
                results.push({ title, link, snippet });
            }
        });

        return results;
    } catch (error) {
        console.error('Search error:', error.message);
        return [];
    }
}

// Scrape content from a specific URL
async function scrapeUrl(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
            timeout: 3000 // STRICT 3s timeout
        });

        const $ = cheerio.load(data);

        $('script, style, nav, footer, .ad, iframe, svg, path').remove();

        let content = '';
        $('p, h1, h2, h3').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 50) {
                content += text + '\n\n';
            }
        });

        return content.substring(0, 3000);
    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        return '';
    }
}

app.post('/api/research', async (req, res) => {
    // Global safety timeout of 5 seconds for the WHOLE request
    const globalTimeoutStart = Date.now();

    try {
        const { query } = req.body;
        console.log(`Processing Research Request: ${query}`);

        // 1. Search
        const searchResults = await searchWeb(query);

        if (searchResults.length === 0) {
            return res.json({ context: "No online results found.", sources: [] });
        }

        // 2. Select Scrape Target (First valid link)
        let combinedContext = "";
        const bestResult = searchResults[0]; // We already filtered bad domains in searchWeb

        if (bestResult) {
            try {
                console.log(`Attempting to scrape: ${bestResult.link}`);
                const pageContent = await scrapeUrl(bestResult.link);
                if (pageContent) {
                    combinedContext += `Source: ${bestResult.title}\nContent: ${pageContent}\n\n`;
                } else {
                    combinedContext += `Source: ${bestResult.title}\nSummary: ${bestResult.snippet} (Site content unavailable)\n\n`;
                }
            } catch (e) {
                console.log(`Scrape failed for top result. Using snippet.`);
                combinedContext += `Source: ${bestResult.title}\nSummary: ${bestResult.snippet}\n\n`;
            }
        }

        // Add backup snippets
        searchResults.slice(1).forEach(result => {
            combinedContext += `Source: ${result.title}\nSummary: ${result.snippet}\n\n`;
        });

        const resultData = {
            context: combinedContext,
            sources: searchResults.map(r => ({ name: r.title, url: r.link }))
        };

        const duration = Date.now() - globalTimeoutStart;
        console.log(`Request completed in ${duration}ms`);
        res.json(resultData);

    } catch (error) {
        console.error('Research API error:', error);
        res.status(200).json({ // Return 200 with fallback to prevent UI crash
            context: "Online search unavailable. Using internal knowledge.",
            sources: []
        });
    }
});

const { handleMessage } = require("./chatEngine");

app.post("/chat", async (req, res) => {
    try {
        const { session_id, message } = req.body;
        const reply = await handleMessage(session_id, message);

        // If it's a stream (Ollama response)
        if (reply && reply.pipe) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Transfer-Encoding', 'chunked');

            reply.on('data', chunk => {
                const json = JSON.parse(chunk.toString());
                if (json.response) {
                    res.write(json.response);
                }
                if (json.done) {
                    res.end();
                }
            });
        } else {
            // Normal string response (rule-based)
            res.json({ reply });
        }

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ reply: "Something went wrong." });
        }
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 FAST SEARCH Backend Running on Port ${PORT}`);
    console.log(`👉 Waiting for requests at http://localhost:${PORT}/api/research`);
    console.log(`=================================================\n`);
});
