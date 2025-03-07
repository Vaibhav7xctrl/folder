const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const ccpPath = path.resolve(__dirname, '../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');

const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function registerUser() {
    try {
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin identity not found in the wallet');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        const userExists = await wallet.get('user2');
        if (userExists) {
            console.log('User2 already exists in the wallet');
            return;
        }

        const enrollment = await ca.enroll({
            enrollmentID: 'user2',
            enrollmentSecret: 'user2pw'
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('user2', x509Identity);
        console.log('Successfully registered and enrolled user2 and stored in the wallet');
    } catch (error) {
        console.error(`Failed to register user2: ${error}`);
    }
}

registerUser();
