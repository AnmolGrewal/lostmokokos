/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, Collapse, FormControlLabel, FormGroup } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Raid } from '../../data/raidsInfo';
import SettingsIcon from '@mui/icons-material/Settings';
import Chip from '@mui/material/Chip';
import { clsx } from 'clsx';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface GoldGridProps {
  raids: Raid[];
}

interface RaidGroup {
  [label: string]: Raid[];
}

interface CharacterState {
  [key: string]: boolean[];
}

const GoldGrid: React.FC<GoldGridProps> = ({ raids }) => {
  const initializeNewCharacterState = useCallback((): CharacterState => {
    let newState: CharacterState = {};
    raids.forEach(raid => {
      ['normal', 'hard'].forEach(mode => {
        const fullPath = `${raid.path}${mode}`;
        newState[fullPath] = new Array(raid.gateData.gold.length).fill(false);
      });
    });
    return newState;
  }, [raids]);

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [checkedStates, setCheckedStates] = useState<CharacterState[]>([initializeNewCharacterState()]);
  const [characterCount, setCharacterCount] = useState<number>(1);
  const [characterNames, setCharacterNames] = useState<string[]>(['Character 1']);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingCharacterIndex, setEditingCharacterIndex] = useState<number>(-1);
  const [tempName, setTempName] = useState<string>('');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [raidVisibility, setRaidVisibility] = useState<boolean[]>(raids.map(() => true));

  const toggleRaidVisibility = (labelIndex: number) => {
    const label = Object.keys(raidGroups)[labelIndex];
    const updatedVisibility = raidVisibility.map((visible, i) => i === labelIndex ? !visible : visible);
    setRaidVisibility(updatedVisibility);
    localStorage.setItem('raidVisibility', JSON.stringify(updatedVisibility));
  
    // If the raid is being hidden, set all associated check states to false
    if (!updatedVisibility[labelIndex]) {
      const raidsInGroup = raidGroups[label];
  
      setCheckedStates(prevStates => prevStates.map(characterState => {
        let newState = { ...characterState };
        raidsInGroup.forEach(raid => {
          ['normal', 'hard'].forEach(mode => {
            const fullPath = `${raid.path}${mode}`;
            if (newState[fullPath]) {
              newState[fullPath] = newState[fullPath].map(() => false);
            }
          });
        });
        return newState;
      }));
    }
  };

  useEffect(() => {
    const savedRaidVisibility = JSON.parse(localStorage.getItem('raidVisibility') || '[]');
    if (savedRaidVisibility.length === raids.length) {
      setRaidVisibility(savedRaidVisibility);
    }
  }, [raids.length]);

  useEffect(() => {
    const savedCharacterCount = parseInt(localStorage.getItem('characterCount') || '0', 10);
    const savedCharacterNames = JSON.parse(localStorage.getItem('characterNames') || '[]');
    const savedCheckedStates = JSON.parse(localStorage.getItem('checkedStates') || '[]');

    setCharacterCount(savedCharacterCount || 1); // Ensure at least 1 character is initialized
    setCharacterNames(savedCharacterNames.length ? savedCharacterNames : Array(savedCharacterCount || 1).fill('Character'));
    setCheckedStates(savedCheckedStates.length ? savedCheckedStates : Array.from({ length: savedCharacterCount || 1 }, () => initializeNewCharacterState()));
  }, [initializeNewCharacterState]);

  useEffect(() => {
    localStorage.setItem('characterCount', characterCount.toString());
    localStorage.setItem('characterNames', JSON.stringify(characterNames));
    localStorage.setItem('checkedStates', JSON.stringify(checkedStates));
  }, [characterCount, characterNames, checkedStates]);

  const handleAddCharacter = () => {
    const newCharacterName = `Character ${characterCount + 1}`;
    setCharacterCount(prev => prev + 1);
    setCharacterNames(prev => [...prev, newCharacterName]);
    setCheckedStates(prev => [...prev, initializeNewCharacterState()]);
  };

  const handleRemoveCharacter = () => {
    if (characterCount > 1) {
      setCharacterCount(prev => prev - 1);
      setCharacterNames(prev => prev.slice(0, -1));
      setCheckedStates(prev => prev.slice(0, -1));
    }
  };

  const handleOpenEditDialog = (index: number) => {
    setEditingCharacterIndex(index);
    setTempName(characterNames[index]);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSaveCharacterName = () => {
    const updatedNames = [...characterNames];
    updatedNames[editingCharacterIndex] = tempName;
    setCharacterNames(updatedNames);
    handleCloseEditDialog();
  };

  const handleToggle = (raidPath: string, mode: 'normal' | 'hard') => {
    const fullPath = raidPath + mode;
    setOpen(prev => ({ ...prev, [fullPath]: !prev[fullPath] }));
  };

  const handleMainCheckboxChange = (raidPath: string, mode: 'normal' | 'hard', columnIndex: number) => {
    const fullPath = raidPath + mode;
    const allChecked = checkedStates[columnIndex][fullPath]?.every(Boolean);
    setCheckedStates(prevStates => prevStates.map((state, index) => {
      if (index === columnIndex) {
        let updatedState = { ...state };
        updatedState[fullPath] = updatedState[fullPath].map(() => !allChecked);
        return updatedState;
      }
      return state;
    }));
  };

  const handleGateCheckboxChange = (raidPath: string, mode: 'normal' | 'hard', columnIndex: number, index: number) => {
    const fullPath = raidPath + mode;
    setCheckedStates(prevStates => {
      const newState = [...prevStates];
      newState[columnIndex] = {
        ...newState[columnIndex],
        [fullPath]: newState[columnIndex][fullPath]?.map((value, i) => i === index ? !value : value) || []
      };
      return newState;
    });
  };

  const calculateTotalGold = () => {
    let total = 0;
    for (let i = 0; i < characterCount; i++) {
      total += calculateCharacterTotalGold(i);
    }
    return total.toLocaleString(); // Formats the total gold with commas
  };

  const raidGroups: RaidGroup = raids.reduce((acc: RaidGroup, raid: Raid) => {
    const label = raid.label;
    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(raid);
    return acc;
  }, {});

  const calculateCharacterTotalGold = (characterIndex: number) => {
    const total = Object.entries(checkedStates[characterIndex] || {}).reduce((characterSum, [key, checks]) => {
      const raidPath = key.replace(/normal|hard/, '');
      const raidIndex = raids.findIndex(r => r.path === raidPath);
      if (raidIndex !== -1 && raidVisibility[raidIndex]) { // Check if raid is visible
        const raid = raids[raidIndex];
        const sum = raid.gateData.gold.reduce((sum, gold, index) => sum + (checks[index] ? gold : 0), 0);
        return characterSum + sum;
      }
      return characterSum; // If raid is not visible, don't include its gold
    }, 0);
    return total; // Returns the numeric total gold for a character
  };

  const handleToggleSettingsDialog = () => {
    setSettingsDialogOpen(!settingsDialogOpen);
  };

  const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);

  const handleToggleHelpDialog = () => {
    setHelpDialogOpen(!helpDialogOpen);
  };

  return (
    <div>
      <h2 className="text-primary-text-color text-2xl mt-2 text-center">
        {'Gold Calculator'}
        <IconButton onClick={handleAddCharacter} size="small" sx={{ color: "var(--primary-text-color)", bgcolor: "var(--image-background-color)", borderRadius: "50%", p: "5px", ml: "25px", mr: "5px", "&:hover": { bgcolor: "var(--primary-background-hover-color)" } }}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={handleRemoveCharacter} size="small" sx={{ color: "var(--primary-text-color)", bgcolor: "var(--image-background-color)", borderRadius: "50%", mr: "5px", p: "5px", "&:hover": { bgcolor: "var(--primary-background-hover-color)" } }}>
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={handleToggleSettingsDialog} size="small" sx={{ color: "var(--primary-text-color)", bgcolor: "var(--image-background-color)", borderRadius: "50%", mr: "5px", p: "5px", "&:hover": { bgcolor: "var(--primary-background-hover-color)" } }}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={handleToggleHelpDialog} size="small" sx={{ color: "var(--primary-text-color)", bgcolor: "var(--image-background-color)", borderRadius: "50%", p: "5px", "&:hover": { bgcolor: "var(--primary-background-hover-color)" } }}>
          <HelpOutlineIcon />
        </IconButton>
      </h2>

      <Dialog open={helpDialogOpen} onClose={handleToggleHelpDialog} sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
        }
      }}>
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)', textAlign: 'center' }}>Help</DialogTitle>
        <DialogContent>
          <div className="mt-3">
            <p className="text-sm text-center">Click on each icon to perform the corresponding action:</p>
            <ul className="text-sm">
              <li className="mt-1 flex items-center justify-center">
                <AddIcon sx={{ mr: 1 }} />
                <span>Add character column</span>
              </li>
              <li className="mt-1 flex items-center justify-center">
                <RemoveIcon sx={{ mr: 1 }} />
                <span>Remove character column</span>
              </li>
              <li className="mt-1 flex items-center justify-center">
                <SettingsIcon sx={{ mr: 1 }} />
                <span>Select raids to show or remove from the grid</span>
              </li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleHelpDialog} sx={{ color: 'inherit' }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Others */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
        }
      }}>
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)' }}>Set Character Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label=""
            type="text"
            fullWidth
            variant="standard"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            InputProps={{
              sx: { color: 'inherit' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={{ color: 'inherit' }}>Cancel</Button>
          <Button onClick={handleSaveCharacterName} type="submit" sx={{ color: 'inherit' }}>Save</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={settingsDialogOpen} onClose={handleToggleSettingsDialog} sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
        }
      }}>
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)', textAlign: 'center' }}>Manage Raids</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(raidGroups).map((label, index) => (
              <Chip
                key={index}
                label={label}
                onClick={() => toggleRaidVisibility(index)}
                color="primary"
                className={clsx(
                  "flex items-center px-3 py-1 rounded-full transition-all duration-300 ease-in-out",
                  raidVisibility[index] ? 'bg-primary-background-selection-color active-raid' : 'bg-chip-background-color',
                  !raidVisibility[index] && "hover:bg-primary-background-hover-color hover:scale-105 cursor-pointer"
                )}
                sx={{
                  color: '#fff',
                  margin: '5px',
                  '&:hover': {
                    bgcolor: '#572C2C' // Ensure hover effects are still applicable
                  }
                }}
                variant="outlined"
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleSettingsDialog} sx={{ color: 'inherit' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{
        width: 'calc(100% - 40px)', // Adjust the width to create distance from edges
        backgroundColor: 'var(--chip-background-color)',
        color: 'var(--primary-text-color)',
        margin: '20px', // Add margin to create distance from edges
        '.MuiTableCell-root': {
          color: 'var(--primary-text-color)',
          borderBottom: '2px solid var(--primary-text-label-color)',
          paddingLeft: 2,
          paddingRight: 2
        },
        '.MuiSvgIcon-root': {
          color: 'var(--primary-text-label-color)',
        }
      }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={1 + characterCount} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Total Gold: {calculateTotalGold()}
                  <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginLeft: '5px' }} />
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px' }}></TableCell>
              {[...Array(characterCount)].map((_, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
                  <Button onClick={() => handleOpenEditDialog(index)} sx={{
                    color: 'inherit',
                    fontFamily: 'Inter, sans-serif', // Ensure 'Inter' font is loaded in your project
                    fontSize: '24px',
                    textTransform: 'none'  // This prevents the text from being all caps
                  }}>
                    {characterNames[index]}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(raidGroups)
              .filter(([label]) => raidVisibility[Object.keys(raidGroups).indexOf(label)])
              .map(([label, groupedRaids], index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                  <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px', position: 'relative', width: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        key={groupedRaids[0].path}
                        src={groupedRaids[0].imgSrc}
                        alt={groupedRaids[0].label}
                        style={{ width: '40px', height: '40px' }}
                      />
                      {label}
                    </div>
                  </TableCell>
                  {[...Array(characterCount)].map((_, characterIndex) => (
                    <TableCell key={characterIndex} sx={{ textAlign: 'center' }}>
                      <FormGroup row className='justify-center'>
                        {groupedRaids.map((raid: Raid) => {
                          const mode = raid.path.includes('-hard') ? 'hard' : 'normal';
                          return (
                            <div key={raid.path} className='min-w-36 text-left'>
                              <IconButton onClick={() => handleToggle(raid.path, mode)} size="small">
                                <ExpandMoreIcon />
                              </IconButton>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checkedStates[characterIndex]?.[raid.path + mode]?.every(Boolean) || false}
                                    indeterminate={checkedStates[characterIndex]?.[raid.path + mode]?.some(Boolean) && !checkedStates[characterIndex]?.[raid.path + mode]?.every(Boolean)}
                                    onChange={() => handleMainCheckboxChange(raid.path, mode, characterIndex)}
                                  />
                                }
                                label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                                sx={{ textAlign: 'center' }} // Center the labels
                              />
                              <Collapse in={open[raid.path + mode]} timeout="auto" unmountOnExit>
                                <div style={{ marginLeft: '40px' }}>
                                  {raid.gateData.gold.map((_, gateIndex: number) => (
                                    <FormControlLabel className='flex justify-center items-center'
                                      key={`${raid.path}-gate-${gateIndex}`}
                                      control={
                                        <Checkbox
                                          checked={checkedStates[characterIndex]?.[raid.path + mode]?.[gateIndex] || false}
                                          onChange={() => handleGateCheckboxChange(raid.path, mode, characterIndex, gateIndex)}
                                          className='flex justify-center items-center'
                                        />
                                      }
                                      label={`Gate ${gateIndex + 1}`}
                                      style={{ display: 'flex'}}
                                    />
                                  ))}
                                </div>
                              </Collapse>
                            </div>
                          );
                        })}
                      </FormGroup>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            <TableRow key={`total-gold-row`}>
              <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                Gold Per Character
              </TableCell>
              {[...Array(characterCount)].map((_, index) => (
                <TableCell key={`character-total-gold-${index}`} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {calculateCharacterTotalGold(index)}
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginLeft: '5px' }} />
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GoldGrid;
