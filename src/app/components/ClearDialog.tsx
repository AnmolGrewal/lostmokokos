import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface ClearDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearDialog: React.FC<ClearDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
        },
      }}
    >
      <DialogTitle sx={{ color: 'var(--primary-text-label-color)' }}>Confirm Clear All Data</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to clear all data and reset to default?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'inherit' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} sx={{ color: 'inherit' }}>
          Clear All Data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClearDialog;