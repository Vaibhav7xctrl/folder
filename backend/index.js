const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Gateway, Wallets } = require('fabric-network');
const bodyParser = require('body-parser');
const config = require('./config.json');
const app = express();
const port = process.env.PORT || 4001;
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  }));

// Use environment variables or defaults for connection
const PEER_HOST = process.env.PEER_HOST || 'localhost';
const PEER_PORT = process.env.PEER_PORT || '7051';
const CA_HOST = process.env.CA_HOST || 'localhost';
const CA_PORT = process.env.CA_PORT || '7054';

app.use(cors());
app.use(express.json());

async function connectToNetwork() {
    const ccpPath = path.resolve(__dirname, config.connectionProfilePath);

    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, config.walletPath);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });



    const network = await gateway.getNetwork(config.channelName);
    const contract = network.getContract(config.chaincodeName);

    return { gateway, contract };
}

// Add new evidence
app.post('/api/evidence', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        const { Name, Type, ID, Source, Location, Timestamp, CID, GroupID } = req.body;

        if (!Name || !Type || !ID || !Source || !Location || !Timestamp || !CID || !GroupID) {
            throw new Error('Missing required fields');
        }

        console.log('Evidence is being linked to Group ID:', GroupID);

        // Connect to the Fabric network
        const { gateway, contract } = await connectToNetwork();

        // Submit the evidence data to the blockchain
        await contract.submitTransaction(
            'CreateEvidence',
            Name,
            Type,
            ID,
            Source,
            Location,
            Timestamp,
            CID,
            GroupID
        );

        // Disconnect from the gateway
        await gateway.disconnect();

        res.json({ success: true, message: 'Evidence added to the blockchain successfully', data: req.body });
    } catch (error) {
        console.error('Failed to create evidence:', error);
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/report', async (req, res) => {
    try {
        console.log('Received request:', req.body); // Log to check if GroupID is received

        const { Name, Type, Timestamp, CID, GroupID } = req.body;

        if (!Name || !Type ||  !Timestamp || !CID || !GroupID) {
            throw new Error('Missing required fields');
        }

        console.log('Report is being linked to Group ID:', GroupID); // Check this log

        res.json({ success: true, message: 'Report added successfully', data: req.body });
    } catch (error) {
        console.error('Failed to report:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/record-request', (req, res) => {
    const { evidenceId, userId, timestamp} = req.body;
  
    // Log the request (for now, since blockchain isn't connected)
    console.log('Received request to record evidence access:', { evidenceId, userId, timestamp});
  
    // Simulate a successful response
    res.json({ success: true, message: 'Request recorded successfully' });
  });
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Make sure your Fabric network is running and the connection profile is correct`);
}); 
