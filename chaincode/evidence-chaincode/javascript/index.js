const { Contract } = require('fabric-contract-api');

class EvidenceContract extends Contract {
    async CreateEvidence(ctx, Name, Type, ID, Source, Location, Timestamp, CID, GroupID) {
        // Validate input
        if (!Name || !Type || !ID || !Source || !Location || !Timestamp || !CID || !GroupID) {
            throw new Error('Missing required fields');
        }

        // Create evidence object
        const evidence = {
            Name,
            Type,
            ID,
            Source,
            Location,
            Timestamp,
            CID,
            GroupID,
        };

        // Save evidence to the ledger
        await ctx.stub.putState(ID, Buffer.from(JSON.stringify(evidence)));

        // Return the evidence object
        return JSON.stringify(evidence);
    }

    async ReadEvidence(ctx, ID) {
        const evidenceJSON = await ctx.stub.getState(ID);
        if (!evidenceJSON || evidenceJSON.length === 0) {
            throw new Error(`Evidence with ID ${ID} does not exist`);
        }
        return evidenceJSON.toString();
    }
}

module.exports = EvidenceContract;
