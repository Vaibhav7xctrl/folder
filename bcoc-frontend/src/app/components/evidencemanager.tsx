import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { Evidence, fabricService } from '../services/fabricService';

interface NewEvidence {
  Type: string;
  Location: string;
  Owner: string;
  Source: string;
  AppraiseValue: number;
  CID: string;
}

export const EvidenceManager: React.FC = () => {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [open, setOpen] = useState(false);
  const [newEvidence, setNewEvidence] = useState<NewEvidence>({
    Type: '',
    Location: '',
    Owner: '',
    Source: '',
    AppraiseValue: 0,
    CID: '',
  });

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      console.log('Loading evidence...');
      const data = await fabricService.getAllEvidence();
      console.log('Evidence loaded:', data);
      setEvidence(data);
    } catch (error: any) {
      console.error('Error loading evidence:', error);
      alert(`Error loading evidence: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const evidenceToSubmit = {
        ID: newEvidence.CID,          // CID input becomes ID
        Type: newEvidence.Type,       // Type input becomes Type
        Location: newEvidence.Location, // Location input becomes Location
        Owner: newEvidence.Owner,     // Owner input becomes Owner
        Source: newEvidence.Source,   // Source stays as Source
        AppraiseValue: 0,             // Fixed value for AppraiseValue
        CID: newEvidence.CID,         // Required for type
        Timestamp: String(newEvidence.AppraiseValue)  // AppraiseValue becomes Timestamp
      };
      
      console.log('Submitting evidence:', evidenceToSubmit);
      const result = await fabricService.addEvidence(evidenceToSubmit);
      console.log('Evidence added successfully:', result);
      setOpen(false);
      await loadEvidence();
      setNewEvidence({
        Type: '',
        Location: '',
        Owner: '',
        Source: '',
        AppraiseValue: 0,
        CID: ''
      });
    } catch (error: any) {
      console.error('Error adding evidence:', error);
      alert(`Error adding evidence: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleTransfer = async (id: string, newOwner: string) => {
    try {
      await fabricService.transferEvidence(id, newOwner);
      loadEvidence();
    } catch (error) {
      console.error('Error transferring evidence:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewEvidence({
      Type: '',
      Location: '',
      Owner: '',
      Source: '',
      AppraiseValue: 0,
      CID: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvidence(prev => ({
      ...prev,
      [name]: name === 'AppraiseValue' ? Number(value) : value
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Evidence Management System
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          sx={{ mb: 2 }}
        >
          Add New Evidence
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Appraised Value</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evidence.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell>{item.ID}</TableCell>
                  <TableCell>{item.Type}</TableCell>
                  <TableCell>{item.Location}</TableCell>
                  <TableCell>{item.Owner}</TableCell>
                  <TableCell>{item.Source}</TableCell>
                  <TableCell>{item.AppraiseValue}</TableCell>
                  <TableCell>{item.Timestamp}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        const newOwner = prompt('Enter new owner:');
                        if (newOwner) {
                          handleTransfer(item.ID, newOwner);
                        }
                      }}
                    >
                      Transfer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Add New Evidence</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                name="Type"
                label="ID"
                type="text"
                fullWidth
                value={newEvidence.Type}
                onChange={handleInputChange}
                autoFocus
              />
              <TextField
                margin="dense"
                name="Owner"
                label="Type"
                type="text"
                fullWidth
                value={newEvidence.Owner}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="CID"
                label="Location"
                type="text"
                fullWidth
                value={newEvidence.CID}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="Location"
                label="Owner"
                type="text"
                fullWidth
                value={newEvidence.Location}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="Source"
                label="Source"
                type="text"
                fullWidth
                value={newEvidence.Source}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="AppraiseValue"
                label="Appraised Value"
                type="number"
                fullWidth
                value={newEvidence.AppraiseValue}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add Evidence
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
}; 