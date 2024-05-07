/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, Collapse, FormControlLabel, FormGroup } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Raid } from '../../data/raidsInfo';

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
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [checkedStates, setCheckedStates] = useState<CharacterState[]>([]);
  const [characterCount, setCharacterCount] = useState<number>(1);
  const [characterNames, setCharacterNames] = useState<string[]>(Array(characterCount).fill('Character'));
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingCharacterIndex, setEditingCharacterIndex] = useState<number>(-1);
  const [tempName, setTempName] = useState<string>('');

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

  useEffect(() => {
    setCharacterNames(Array(characterCount).fill('Character'));
  }, [characterCount]);

  useEffect(() => {
    const initializeCheckedStates = () => {
      setCheckedStates(prevStates => {
        const initialCheckedStates = Array.from({ length: characterCount }, (_, index) => {
          if (prevStates[index]) {
            return { ...prevStates[index] };
          } else {
            return {};
          }
        });
        
        raids.forEach(raid => {
          ['normal', 'hard'].forEach(mode => {
            const fullPath = raid.path + mode;
            if (raid.path.includes(mode)) {
              initialCheckedStates.forEach((state) => {
                if (!state[fullPath]) {
                  state[fullPath] = new Array(raid.gateData.gold.length).fill(false);
                }
              });
            }
          });
        });
  
        return initialCheckedStates;
      });
    };
  
    initializeCheckedStates();
  }, [raids, characterCount]);

  const handleToggle = (raidPath: string, mode: 'normal' | 'hard') => {
    const fullPath = raidPath + mode;
    setOpen(prev => ({ ...prev, [fullPath]: !prev[fullPath] }));
  };

  const handleMainCheckboxChange = (raidPath: string, mode: 'normal' | 'hard', columnIndex: number) => {
    const fullPath = raidPath + mode;
    const allChecked = checkedStates[columnIndex][fullPath]?.every(Boolean);
    setCheckedStates(prevStates => prevStates.map((state, index) => {
      return index === columnIndex ? { ...state, [fullPath]: state[fullPath]?.map(() => !allChecked) || [] } : state;
    }));

    // Update gate checkboxes when main checkbox is changed
    if (mode === 'normal') {
      const raid = raids.find(r => r.path === raidPath);
      const gateCount = raid?.gateData.gold.length || 0;
      const gateStates = new Array(gateCount).fill(!allChecked);
      setCheckedStates(prevStates => prevStates.map((state, index) => {
        return index === columnIndex ? {
          ...state,
          [raidPath + 'hard']: state[raidPath + 'hard']?.map(() => !allChecked) || [],
          [raidPath + 'normal']: gateStates
        } : state;
      }));
    }
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
    return Object.entries(checkedStates).reduce((totalSum, characterState) => {
      return totalSum + Object.entries(characterState[1]).reduce((characterSum, [key, checks]) => {
        const raidPath = key.replace(/normal|hard/, '');
        const raid = raids.find(r => r.path === raidPath);
        const sum = raid ? raid.gateData.gold.reduce((sum, gold, index) => sum + (checks[index] ? gold : 0), 0) : 0;
        return characterSum + sum;
      }, 0);
    }, 0);
  };

  const raidGroups: RaidGroup = raids.reduce((acc: RaidGroup, raid: Raid) => {
    const label = raid.label;
    acc[label] = acc[label] || [];
    acc[label].push(raid);
    return acc;
  }, {});

  const handleAddCharacter = () => {
    setCharacterCount(prevCount => prevCount + 1);
  };

  const handleRemoveCharacter = () => {
    if (characterCount > 1) {
      setCharacterCount(prevCount => prevCount - 1);
    }
  };

  const calculateCharacterTotalGold = (characterIndex: number) => {
    return Object.entries(checkedStates[characterIndex] || {}).reduce((characterSum, [key, checks]) => {
      const raidPath = key.replace(/normal|hard/, '');
      const raid = raids.find(r => r.path === raidPath);
      const sum = raid ? raid.gateData.gold.reduce((sum, gold, index) => sum + (checks[index] ? gold : 0), 0) : 0;
      return characterSum + sum;
    }, 0);
  };

  return (
    <div>
      <h2 className="text-primary-text-color text-2xl mt-2 text-center">
        {'Gold Calculator'}
        <IconButton onClick={handleAddCharacter} size="small" style={{ color: "var(--primary-text-color)" }}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={handleRemoveCharacter} size="small" style={{ color: "var(--primary-text-color)" }}>
          <RemoveIcon />
        </IconButton>
      </h2>
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
            {Object.entries(raidGroups).map(([label, groupedRaids], index) => (
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
                Character Total Gold
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
