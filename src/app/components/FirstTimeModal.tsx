import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull, faUserNinja } from '@fortawesome/free-solid-svg-icons';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface FirstTimeModalProps {
  open: boolean;
  onClose: () => void;
}

const FirstTimeModal: React.FC<FirstTimeModalProps> = ({ open, onClose }) => {
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
      <DialogTitle sx={{ color: 'var(--primary-text-label-color)', textAlign: 'center' }}>Welcome to Raid Details!</DialogTitle>
      <DialogContent>
        <div className="mt-3">
          <p className="text-sm text-center mb-10">Use these icons to navigate between raid versions:</p>
          <ul className="text-sm justify-center items-center">
            <li className="mt-4 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <FontAwesomeIcon icon={faUserNinja} className="text-blue-500" size="2x" />
              </div>
              <span>Switch to Solo mode</span>
            </li>
            <li className="mt-4 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <FontAwesomeIcon icon={faSkull} className="text-red-500" size="2x" />
              </div>
              <span>Switch to Hard mode</span>
            </li>
            <li className="mt-4 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <CompareArrowsIcon className="text-red-500" sx={{ fontSize: 34 }} />
              </div>
              <span>Compare differences between Normal and Hard mode</span>
            </li>
          </ul>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'inherit' }}>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FirstTimeModal;