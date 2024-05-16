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
import TitleIcon from '@mui/icons-material/Title';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const [additionalGold, setAdditionalGold] = useState<number[]>(new Array(characterCount).fill(0));

  const [additionalGoldDialogOpen, setAdditionalGoldDialogOpen] = useState<boolean>(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(-1);
  const [tempAdditionalGold, setTempAdditionalGold] = useState<number>(0);

  const handleOpenAdditionalGoldDialog = (index: number) => {
    setCurrentEditingIndex(index);
    setTempAdditionalGold(additionalGold[index]);
    setAdditionalGoldDialogOpen(true);
  };

  const handleCloseAdditionalGoldDialog = () => {
    setAdditionalGoldDialogOpen(false);
  };

  const handleSaveAdditionalGold = () => {
    const updatedGold = [...additionalGold];
    updatedGold[currentEditingIndex] = tempAdditionalGold;
    setAdditionalGold(updatedGold);
    handleCloseAdditionalGoldDialog();
  };

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
    const loadInitialData = () => {
      const savedRaidVisibility = JSON.parse(localStorage.getItem('raidVisibility') || '[]');
      const savedCharacterCount = parseInt(localStorage.getItem('characterCount') || '1', 10);
      const savedCharacterNames = JSON.parse(localStorage.getItem('characterNames') || '[]');
      const defaultCharacterNames = Array(savedCharacterCount).fill('Character').map((name, index) => `${name} ${index + 1}`);
      const savedCheckedStates = JSON.parse(localStorage.getItem('checkedStates') || '[]');
      const savedAdditionalGold = JSON.parse(localStorage.getItem('additionalGold') || '[]');
      const defaultAdditionalGold = new Array(savedCharacterCount).fill(0);
  
      setRaidVisibility(savedRaidVisibility.length ? savedRaidVisibility : raids.map(() => true));
      setCharacterCount(savedCharacterCount);
      setCharacterNames(savedCharacterNames.length ? savedCharacterNames : defaultCharacterNames);
      setCheckedStates(savedCheckedStates.length ? savedCheckedStates : Array.from({ length: savedCharacterCount }, initializeNewCharacterState));
  
      if (savedAdditionalGold.length === savedCharacterCount) {
        setAdditionalGold(savedAdditionalGold);
      } else {
        setAdditionalGold(defaultAdditionalGold);
      }
    };
  
    loadInitialData();
  }, [raids.length, initializeNewCharacterState, raids]);

  useEffect(() => {
    // Save all character related data to localStorage
    localStorage.setItem('characterCount', characterCount.toString());
    localStorage.setItem('characterNames', JSON.stringify(characterNames));
    localStorage.setItem('checkedStates', JSON.stringify(checkedStates));
    localStorage.setItem('additionalGold', JSON.stringify(additionalGold));
  }, [characterCount, characterNames, checkedStates, additionalGold]);

  const handleAddCharacter = () => {
    const newCharacterName = `Character ${characterCount + 1}`;
    setCharacterCount(prev => prev + 1);
    setCharacterNames(prev => [...prev, newCharacterName]);
    setCheckedStates(prev => [...prev, initializeNewCharacterState()]);
    setAdditionalGold(prev => {
      const newGoldArray = [...prev, 0];
      return newGoldArray;
    });
  };

  const handleRemoveCharacter = () => {
    if (characterCount > 1) {
      setCharacterCount(prev => prev - 1);
      setCharacterNames(prev => prev.slice(0, -1));
      setCheckedStates(prev => prev.slice(0, -1));
      setAdditionalGold(prev => prev.slice(0, -1));
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
      total += calculateCharacterTotalGold(i) + additionalGold[i];
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
    return total + additionalGold[characterIndex]; // Returns the numeric total gold for a character
  };

  const handleToggleSettingsDialog = () => {
    setSettingsDialogOpen(!settingsDialogOpen);
  };

  const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);

  const handleToggleHelpDialog = () => {
    setHelpDialogOpen(!helpDialogOpen);
  };

  const handleClearAllData = () => {
    setCharacterCount(1);
    setCharacterNames(['Character 1']);
    setCheckedStates([initializeNewCharacterState()]);
    setAdditionalGold(new Array(1).fill(0));
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
        <IconButton onClick={handleToggleHelpDialog} size="small" sx={{ color: "var(--primary-text-color)", bgcolor: "var(--image-background-color)", borderRadius: "50%",mr: "5px", p: "5px", "&:hover": { bgcolor: "var(--primary-background-hover-color)" } }}>
          <HelpOutlineIcon />
        </IconButton>
        <IconButton onClick={handleClearAllData} size="small" sx={{ color: "var(--primary-text-color)", bgcolor: "var(--image-background-color)", borderRadius: "50%", p: "5px", "&:hover": { bgcolor: "var(--primary-background-hover-color)" } }}>
          <DeleteIcon />
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
            <p className="text-sm text-center mb-10">Click on each icon to perform the corresponding action:</p>
            <ul className="text-sm justify-center items-center">
              <li className="mt-4 flex">
                <AddIcon sx={{ mr: 1 }} />
                <span className='mt-0.5'>Add character column</span>
              </li>
              <li className="mt-4 flex">
                <RemoveIcon sx={{ mr: 1 }} />
                <span className='mt-0.5'>Remove character column</span>
              </li>
              <li className="mt-4 flex">
                <SettingsIcon sx={{ mr: 1 }} />
                <span className='mt-0.5'>Select raids to show or remove from the grid</span>
              </li>
              <li className="mt-4 flex">
                <TitleIcon sx={{ mr: 1 }} />
                <span className='mt-0.5'>Select character column title to change character name</span>
              </li>
              <li className="mt-4 flex">
                <EditIcon sx={{ mr: 1 }} />
                <span className='mt-0.5'>Click to edit the particular field in question</span>
              </li>
              <li className="mt-4 flex">
                <DeleteIcon sx={{ mr: 1 }} />
                <span className='mt-0.5'>Click to clear all data and reset to default</span>
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
          <div className="mt-3">
            <p className="text-sm text-center mb-10">Select A Raid Below to Toggle Raid Visibility</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(raidGroups).map((label, index) => (
              <Chip
                key={index}
                label={label}
                onClick={() => toggleRaidVisibility(index)}
                className={clsx(
                  "!flex !items-center !px-3 !py-1 !rounded-full !transition-all !duration-300 !ease-in-out raid-chip",
                  raidVisibility[index] ? '!bg-primary-background-selection-color !active-raid' : '!bg-chip-background-color',
                  !raidVisibility[index] && "!hover:bg-primary-background-hover-color !hover:scale-105 !cursor-pointer",
                  "!text-white !m-1"
                )}
                variant="outlined"
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleSettingsDialog} sx={{ color: 'inherit' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={additionalGoldDialogOpen} onClose={handleCloseAdditionalGoldDialog} sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
        }
      }}>
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)' }}>Enter Additional Gold</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="additionalGold"
            label="Gold Amount"
            type="number"
            fullWidth
            variant="standard"
            value={tempAdditionalGold}
            onChange={(e) => setTempAdditionalGold(parseInt(e.target.value) || 0)}
            InputProps={{
              sx: { color: 'inherit' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdditionalGoldDialog} sx={{ color: 'inherit' }}>Cancel</Button>
          <Button onClick={handleSaveAdditionalGold} sx={{ color: 'inherit' }}>Save</Button>
        </DialogActions>
      </Dialog>

      <TableContainer
        component={Paper}
        sx={(theme) => ({
          width: 'calc(100% - 40px)',
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
          margin: '20px',
          marginBottom: '55px', // Default to 55px
          [theme.breakpoints.up(640)]: { // Directly using 640 pixels as the breakpoint
            marginBottom: '85px', // Applies 85px margin-bottom at 640 pixels width and above
          },
          '.MuiTableCell-root': {
            color: 'var(--primary-text-color)',
            borderBottom: '2px solid var(--primary-text-label-color)',
            paddingLeft: '2px',
            paddingRight: '2px'
          },
          '.MuiSvgIcon-root': {
            color: 'var(--primary-text-label-color)',
          }
        })}
      >
        <Table aria-label="simple table">
          <TableHead>
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
                  <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px', position: 'relative', width: 'fit-content', flexShrink: 0, minWidth: "150px"}}>
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0}}>
                      <img
                        key={groupedRaids[0].path}
                        src={groupedRaids[0].imgSrc}
                        alt={groupedRaids[0].label}
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div className='shrink-0'>
                        {label}
                      </div>
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
            <TableRow>
              <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                <div className='flex flex-row'>
                  <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '40px', verticalAlign: 'middle' }} />
                  Extra Gold
                </div>
              </TableCell>
              {[...Array(characterCount)].map((_, index) => (
                <TableCell key={index} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '43px'}}>
                    <IconButton onClick={() => handleOpenAdditionalGoldDialog(index)}>
                      <EditIcon />
                    </IconButton>
                    {additionalGold[index].toLocaleString()}
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginLeft: '5px' }} />
                  </span>
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={`total-gold-row`}>
              <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                Gold Per Character
              </TableCell>
              {[...Array(characterCount)].map((_, index) => (
                <TableCell key={`character-total-gold-${index}`} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {calculateCharacterTotalGold(index).toLocaleString()}
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginLeft: '5px' }} />
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 bg-primary-background-color text-primary-text-color text-center p-2 rounded-full border border-primary-border-color shadow-md inline-flex items-center justify-center gap-2 sm:p-4 sm:text-2xl">
        Total Gold: {calculateTotalGold()}
        <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" className="w-5 sm:w-10" />
      </footer>
    </div>
  );
};

export default GoldGrid;
