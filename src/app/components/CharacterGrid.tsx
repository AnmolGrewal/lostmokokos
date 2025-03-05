/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Rating,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Raid } from '../../data/raidsInfo';
import SettingsIcon from '@mui/icons-material/Settings';
import PestControlIcon from '@mui/icons-material/PestControl';
import PeopleIcon from '@mui/icons-material/People';
import BalconyIcon from '@mui/icons-material/Balcony';
import Chip from '@mui/material/Chip';
import { clsx } from 'clsx';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TitleIcon from '@mui/icons-material/Title';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { styled } from '@mui/material/styles';
import {useClockBar} from './useClockBar';
import ClearDialog from './ClearDialog';
import HistoryIcon from '@mui/icons-material/History';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.text.primary,
  },
  '& .MuiRating-iconEmpty': {
    color: theme.palette.action.disabled,
  },
  '& .MuiRating-icon': {
    fontSize: '40px',
  },
}));

interface GoldGridProps {
  raids: Raid[];
}

interface RaidGroup {
  [label: string]: Raid[];
}

interface CharacterState {
  [key: string]: boolean[];
}

const CharacterGrid: React.FC<GoldGridProps> = ({ raids }) => {
  const initializeNewCharacterState = useCallback((): CharacterState => {
    const newState: CharacterState = {};
    raids.forEach((raid) => {
      newState[raid.path] = new Array(raid.gateData.gold.length).fill(false);
    });
    return newState;
  }, [raids]);

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [checkedStates, setCheckedStates] = useState<CharacterState[]>([initializeNewCharacterState()]);
  const [boxCheckedStates, setBoxCheckedStates] = useState<CharacterState[]>([initializeNewCharacterState()]);
  const [characterCount, setCharacterCount] = useState<number>(1);
  const [characterNames, setCharacterNames] = useState<string[]>(['Character 1']);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingCharacterIndex, setEditingCharacterIndex] = useState<number>(-1);
  const [tempName, setTempName] = useState<string>('');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [raidVisibility, setRaidVisibility] = useState<boolean[]>(raids.map(() => true));

  const [additionalGold, setAdditionalGold] = useState<number[]>(new Array(characterCount).fill(0));

  const [additionalGoldDialogOpen, setAdditionalGoldDialogOpen] = useState<boolean>(false);
  const [confirmSweepDialogOpen, setConfirmSweepDialogOpen] = useState<boolean>(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(-1);
  const [tempAdditionalGold, setTempAdditionalGold] = useState<number>(0);

  const [chaosGateRatings, setChaosGateRatings] = useState<number[]>(new Array(characterCount).fill(0));
  const [unaTaskRatings, setUnaTaskRatings] = useState<number[]>(new Array(characterCount).fill(0));
  const [guardianRaidRatings, setGuardianRaidRatings] = useState<number[]>(new Array(characterCount).fill(0));
  const [guildWeekliesRatings, setGuildWeekliesRatings] = useState<number[]>(new Array(characterCount).fill(0));
  const [chaosGateVisibility, setChaosGateVisibility] = useState<boolean>(true);
  const [unaTaskVisibility, setUnaTaskVisibility] = useState<boolean>(true);
  const [guardianRaidVisibility, setGuardianRaidVisibility] = useState<boolean>(true);
  const [guildWeekliesVisibility, setGuildWeekliesVisibility] = useState<boolean>(true);

  const { dailyResetTime, weeklyResetTime } = useClockBar();
  
  useEffect(() => {
    const storedChaosGatesVisibility = localStorage.getItem('chaosGateVisibility');
    const storedUnaTasksVisibility = localStorage.getItem('unaTaskVisibility');
    const storedGuildWeekliesVisibility = localStorage.getItem('guardianRaidVisibility');
    const storedGuardianRaidsVisibility = localStorage.getItem('guildWeekliesVisibility');
  
    if (storedChaosGatesVisibility !== null) {
      setChaosGateVisibility(JSON.parse(storedChaosGatesVisibility));
    }
    if (storedUnaTasksVisibility !== null) {
      setUnaTaskVisibility(JSON.parse(storedUnaTasksVisibility));
    }
    if (storedGuildWeekliesVisibility !== null) {
      setGuardianRaidVisibility(JSON.parse(storedGuildWeekliesVisibility));
    }
    if (storedGuardianRaidsVisibility !== null) {
      setGuildWeekliesVisibility(JSON.parse(storedGuardianRaidsVisibility));
    }
  }, []);

  useEffect(() => {
    const resetDailyCharacterTasks = () => {
      const resetRatings = new Array(characterCount).fill(0);
      setChaosGateRatings(resetRatings);
      setGuardianRaidRatings(resetRatings);
      setUnaTaskRatings(resetRatings);
      localStorage.setItem('chaosGateRatings', JSON.stringify(resetRatings));
      localStorage.setItem('guardianRaidRatings', JSON.stringify(resetRatings));
      localStorage.setItem('unaTaskRatings', JSON.stringify(resetRatings));
      localStorage.setItem('lastDailyReset', dailyResetTime.toString());
    };
    
    const resetGuildWeeklies = () => {
      const resetRatings = new Array(characterCount).fill(0);
      setGuildWeekliesRatings(resetRatings);
      localStorage.setItem('guildWeekliesRatings', JSON.stringify(resetRatings));
      localStorage.setItem('lastWeeklyReset', weeklyResetTime.toString());
    };
  
    const checkResetTimes = () => {
      const currentTime = Date.now();
      const storedDailyResetTime = parseInt(localStorage.getItem('dailyResetTime') || '0', 10);
      const storedWeeklyResetTime = parseInt(localStorage.getItem('weeklyResetTime') || '0', 10);

      if (currentTime >= storedDailyResetTime) {
        resetDailyCharacterTasks();
        const newDailyResetTime = dailyResetTime;
        localStorage.setItem('dailyResetTime', newDailyResetTime.toString());
        localStorage.setItem('lastDailyReset', newDailyResetTime.toString());
      }
      if (currentTime >= storedWeeklyResetTime) {
        resetGuildWeeklies();
        const newWeeklyResetTime = weeklyResetTime;
        localStorage.setItem('weeklyResetTime', newWeeklyResetTime.toString());
        localStorage.setItem('lastWeeklyReset', newWeeklyResetTime.toString());
      }
    };

    const initializeResetTimes = () => {
      const storedDailyResetTime = localStorage.getItem('dailyResetTime');
      const storedWeeklyResetTime = localStorage.getItem('weeklyResetTime');

      if (!storedDailyResetTime) {
        localStorage.setItem('dailyResetTime', dailyResetTime.toString());
      }
      if (!storedWeeklyResetTime) {
        localStorage.setItem('weeklyResetTime', weeklyResetTime.toString());
      }
    };

    initializeResetTimes();
    checkResetTimes();
    const timer = setInterval(checkResetTimes, 300000); // Check every 5 minutes

    return () => {
      clearInterval(timer);
    };
  }, [characterCount, dailyResetTime, weeklyResetTime]);

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
    const updatedVisibility = raidVisibility.map((visible, i) => (i === labelIndex ? !visible : visible));
    setRaidVisibility(updatedVisibility);
    localStorage.setItem('raidVisibility2', JSON.stringify(updatedVisibility));

    // If the raid is being hidden, set all associated check states to false
    if (!updatedVisibility[labelIndex]) {
      const raidsInGroup = raidGroups[label];

      setCheckedStates((prevStates) =>
        prevStates.map((characterState) => {
          const newState = { ...characterState };
          raidsInGroup.forEach((raid) => {
            if (newState[raid.path]) {
              newState[raid.path] = newState[raid.path].map(() => false);
            }
          });
          return newState;
        })
      );
    }
  };

  useEffect(() => {
    const loadInitialData = () => {
      const savedRaidVisibility = JSON.parse(localStorage.getItem('raidVisibility2') || '[]');
      const savedCharacterCount = parseInt(localStorage.getItem('characterCount2') || '1', 10);
      const savedCharacterNames = JSON.parse(localStorage.getItem('characterNames2') || '[]');
      const defaultCharacterNames = Array(savedCharacterCount)
        .fill('Character')
        .map((name, index) => `${name} ${index + 1}`);
      const savedCheckedStates = JSON.parse(localStorage.getItem('checkedStates3') || '[]');
      const savedBoxCheckedStates = JSON.parse(localStorage.getItem('boxCheckedStates3') || '[]');
      const savedAdditionalGold = JSON.parse(localStorage.getItem('additionalGold2') || '[]');
      const defaultAdditionalGold = new Array(savedCharacterCount).fill(0);
      const savedChaosGateRatings = JSON.parse(localStorage.getItem('chaosGateRatings') || '[]');
      const savedUnaTaskRatings = JSON.parse(localStorage.getItem('unaTaskRatings') || '[]');
      const savedGuardianRaidRatings = JSON.parse(localStorage.getItem('guardianRaidRatings') || '[]');
      const savedGuildWeekliesRatings = JSON.parse(localStorage.getItem('guildWeekliesRatings') || '[]');

      setChaosGateRatings(savedChaosGateRatings.length === savedCharacterCount ? savedChaosGateRatings : new Array(savedCharacterCount).fill(0));
      setUnaTaskRatings(savedUnaTaskRatings.length === savedCharacterCount ? savedUnaTaskRatings : new Array(savedCharacterCount).fill(0));
      setGuardianRaidRatings(savedGuardianRaidRatings.length === savedCharacterCount ? savedGuardianRaidRatings : new Array(savedCharacterCount).fill(0));
      setGuildWeekliesRatings(savedGuildWeekliesRatings.length === savedCharacterCount ? savedGuildWeekliesRatings : new Array(savedCharacterCount).fill(0));

      setRaidVisibility(savedRaidVisibility.length ? savedRaidVisibility : raids.map(() => true));
      setCharacterCount(savedCharacterCount);
      setCharacterNames(savedCharacterNames.length ? savedCharacterNames : defaultCharacterNames);
      setCheckedStates(
        savedCheckedStates.length ? savedCheckedStates : Array.from({ length: savedCharacterCount }, initializeNewCharacterState)
      );
      setBoxCheckedStates(
        savedBoxCheckedStates.length ? savedBoxCheckedStates : Array.from({ length: savedCharacterCount }, initializeNewCharacterState)
      );
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
    localStorage.setItem('characterCount2', characterCount.toString());
    localStorage.setItem('characterNames2', JSON.stringify(characterNames));
    localStorage.setItem('checkedStates3', JSON.stringify(checkedStates));
    localStorage.setItem('boxCheckedStates3', JSON.stringify(boxCheckedStates));
    localStorage.setItem('additionalGold2', JSON.stringify(additionalGold));
    localStorage.setItem('chaosGateRatings', JSON.stringify(chaosGateRatings));
    localStorage.setItem('unaTaskRatings', JSON.stringify(unaTaskRatings));
    localStorage.setItem('guardianRaidRatings', JSON.stringify(guardianRaidRatings));
    localStorage.setItem('guildWeekliesRatings', JSON.stringify(guildWeekliesRatings));
  }, [characterCount, characterNames, checkedStates, additionalGold, chaosGateRatings, guardianRaidRatings, guildWeekliesRatings, unaTaskRatings, boxCheckedStates]);  

  const handleAddCharacter = () => {
    const newCharacterName = `Character ${characterCount + 1}`;
    setCharacterCount((prev) => prev + 1);
    setCharacterNames((prev) => [...prev, newCharacterName]);
    setCheckedStates((prev) => [...prev, initializeNewCharacterState()]);
    setAdditionalGold((prev) => {
      const newGoldArray = [...prev, 0];
      return newGoldArray;
    });
    setChaosGateRatings((prev) => [...prev, 0]);
    setUnaTaskRatings((prev) => [...prev, 0]);
    setGuardianRaidRatings((prev) => [...prev, 0]);
    setGuildWeekliesRatings((prev) => [...prev, 0]);
  };  

  const handleRemoveCharacter = () => {
    if (characterCount > 1) {
      setCharacterCount((prev) => prev - 1);
      setCharacterNames((prev) => prev.slice(0, -1));
      setCheckedStates((prev) => prev.slice(0, -1));
      setAdditionalGold((prev) => prev.slice(0, -1));
      setChaosGateRatings((prev) => prev.slice(0, -1));
      setUnaTaskRatings((prev) => prev.slice(0, -1));
      setGuardianRaidRatings((prev) => prev.slice(0, -1));
      setGuildWeekliesRatings((prev) => prev.slice(0, -1));
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

  const handleToggle = (raidPath: string) => {
    setOpen((prev) => ({ ...prev, [raidPath]: !prev[raidPath] }));
  };

  const handleMainCheckboxChange = (raidPath: string, columnIndex: number) => {
    const allChecked = checkedStates[columnIndex][raidPath]?.every(Boolean);
    setCheckedStates((prevStates) =>
      prevStates.map((state, index) => {
        if (index === columnIndex) {
          const updatedState = { ...state };
          updatedState[raidPath] = updatedState[raidPath].map(() => !allChecked);
          return updatedState;
        }
        return state;
      })
    );
  };

  const handleGateCheckboxChange = (raidPath: string, columnIndex: number, index: number) => {
    setCheckedStates((prevStates) => {
      const newState = [...prevStates];
      newState[columnIndex] = {
        ...newState[columnIndex],
        [raidPath]: newState[columnIndex][raidPath]?.map((value, i) => (i === index ? !value : value)) || [],
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
    let total = 0;
    raids.forEach((raid) => {
      total += raid.gateData.gold.reduce((sum, gold, index) => {
        if (checkedStates[characterIndex]?.[raid.path]?.[index]) {
          const boxCost = raid.gateData.boxCost[index] || 0;
          const isBoxChecked = boxCheckedStates[characterIndex]?.[raid.path]?.[index] || false;
          return sum + gold - (isBoxChecked ? boxCost : 0);
        }
        return sum;
      }, 0);
    });
    return total + additionalGold[characterIndex];
  };

  const handleToggleSettingsDialog = () => {
    setSettingsDialogOpen(!settingsDialogOpen);
    if (!settingsDialogOpen) {
      const savedChaosGateVisibility = JSON.parse(localStorage.getItem('chaosGateVisibility') || 'true');
      const savedUnaTaskVisibility = JSON.parse(localStorage.getItem('unaTaskVisibility') || 'true');
      const savedGuardianRaidVisibility = JSON.parse(localStorage.getItem('guardianRaidVisibility') || 'true');
      const savedGuildWeekliesVisibility = JSON.parse(localStorage.getItem('guildWeekliesVisibility') || 'true');
      setChaosGateVisibility(savedChaosGateVisibility);
      setUnaTaskVisibility(savedUnaTaskVisibility);
      setGuardianRaidVisibility(savedGuardianRaidVisibility);
      setGuildWeekliesVisibility(savedGuildWeekliesVisibility);
    }
  };

  const [helpDialogOpen, setHelpDialogOpen] = useState<boolean>(false);

  const handleToggleHelpDialog = () => {
    setHelpDialogOpen(!helpDialogOpen);
  };

  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState<boolean>(false);

  const handleToggleConfirmClearDialog = () => {
    setConfirmClearDialogOpen(!confirmClearDialogOpen);
  };

  const handleClearAllDataConfirmed = () => {
    const newCharacterCount = 1;
  
    setCharacterCount(newCharacterCount);
    setCharacterNames(['Character 1']);
    setCheckedStates([initializeNewCharacterState()]);
    setBoxCheckedStates([initializeNewCharacterState()]);
    setAdditionalGold(new Array(newCharacterCount).fill(0));
    setChaosGateRatings(new Array(newCharacterCount).fill(0));
    setUnaTaskRatings(new Array(newCharacterCount).fill(0));
    setGuardianRaidRatings(new Array(newCharacterCount).fill(0));
    setGuildWeekliesRatings(new Array(newCharacterCount).fill(0));
    handleToggleConfirmClearDialog();
  
    // Clear specific localStorage items
    localStorage.removeItem('characterCount2');
    localStorage.removeItem('characterNames2');
    localStorage.removeItem('checkedStates1');
    localStorage.removeItem('boxCheckedStates1');
    localStorage.removeItem('additionalGold2');
    // localStorage.removeItem('raidVisbility2');
  
    // Clear ratings for chaos, guardian, and weekly from localStorage
    localStorage.removeItem('chaosRating');
    localStorage.removeItem('unaTaskRating');
    localStorage.removeItem('guardianRating');
    localStorage.removeItem('weeklyRating');
  
    // Clear daily reset time and weekly reset time from localStorage
    localStorage.removeItem('dailyResetTime');
    localStorage.removeItem('weeklyResetTime');
  };

  const handleToggleConfirmSweepDialog = () => {
    setConfirmSweepDialogOpen(!confirmSweepDialogOpen);
  };

  const handleSweepCheckedStates = () => {
    setCheckedStates((prevStates) =>
      prevStates.map((characterState) => {
        const newState: CharacterState = {};
        Object.keys(characterState).forEach((raidPath) => {
          newState[raidPath] = new Array(characterState[raidPath].length).fill(false);
        });
        return newState;
      })
    );
    setBoxCheckedStates((prevStates) => // Clear box checked states
      prevStates.map((characterState) => {
        const newState: CharacterState = {};
        Object.keys(characterState).forEach((raidPath) => {
          newState[raidPath] = new Array(characterState[raidPath].length).fill(false);
        });
        return newState;
      })
    );
    handleToggleConfirmSweepDialog();
  };  

  const handleBoxCheckboxChange = (raidPath: string, columnIndex: number, index: number) => {
    setBoxCheckedStates((prevStates) => {
      const newState = [...prevStates];
      const raid = raids.find((r) => r.path === raidPath);
      if (raid) {
        if (!newState[columnIndex]) {
          newState[columnIndex] = {};
        }
        if (!newState[columnIndex][raidPath]) {
          newState[columnIndex][raidPath] = Array(raid.gateData.gold.length).fill(false);
        }
        const isChecked = !newState[columnIndex][raidPath][index];
        newState[columnIndex][raidPath] = newState[columnIndex][raidPath].map((value, i) => (i === index ? !value : value));
  
        // Update the corresponding gate checkbox state only if the chest checkbox is checked
        if (isChecked) {
          setCheckedStates((prevCheckedStates) => {
            const updatedCheckedStates = [...prevCheckedStates];
            if (!updatedCheckedStates[columnIndex]) {
              updatedCheckedStates[columnIndex] = {};
            }
            if (!updatedCheckedStates[columnIndex][raidPath]) {
              updatedCheckedStates[columnIndex][raidPath] = Array(raid.gateData.gold.length).fill(false);
            }
            updatedCheckedStates[columnIndex][raidPath][index] = true;
            return updatedCheckedStates;
          });
        }
      }
      return newState;
    });
  };  

  return (
    <div>
      <h2 className="text-primary-text-color text-2xl mt-2 text-center">
        {'Character Sheet'}
        <IconButton
          onClick={handleAddCharacter}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            p: '5px',
            ml: '25px',
            mr: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={handleRemoveCharacter}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            mr: '5px',
            p: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <RemoveIcon />
        </IconButton>
        <IconButton
          onClick={handleToggleSettingsDialog}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            mr: '5px',
            p: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <SettingsIcon />
        </IconButton>
        <IconButton
          onClick={handleToggleHelpDialog}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            mr: '5px',
            p: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <HelpOutlineIcon />
        </IconButton>
        <IconButton
          onClick={handleToggleConfirmClearDialog}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            p: '5px',
            mr: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={handleToggleConfirmSweepDialog}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            p: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <HistoryIcon />
        </IconButton>
      </h2>
      <ClearDialog
        open={confirmClearDialogOpen}
        onClose={handleToggleConfirmClearDialog}
        onConfirm={handleClearAllDataConfirmed}
      />
      <Dialog
        open={helpDialogOpen}
        onClose={handleToggleHelpDialog}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--chip-background-color)',
            color: 'var(--primary-text-color)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)', textAlign: 'center' }}>Help</DialogTitle>
        <DialogContent>
          <div className="mt-3">
            <p className="text-sm text-center mb-10">Click on each icon to perform the corresponding action:</p>
            <ul className="text-sm justify-center items-center">
              <li className="mt-4 flex">
                <AddIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Add character column</span>
              </li>
              <li className="mt-4 flex">
                <RemoveIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Remove character column</span>
              </li>
              <li className="mt-4 flex">
                <SettingsIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Select raids to show or remove from the grid</span>
              </li>
              <li className="mt-4 flex">
                <TitleIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Select character column title to change character name</span>
              </li>
              <li className="mt-4 flex">
                <EditIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Click to edit the particular field in question</span>
              </li>
              <li className="mt-4 flex">
                <DeleteIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Click to clear all data and reset to default</span>
              </li>
              <li className="mt-4 flex">
                <HistoryIcon sx={{ mr: 1 }} />
                <span className="mt-0.5">Click to reset raid data for every character</span>
              </li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleHelpDialog} sx={{ color: 'inherit' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Others */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--chip-background-color)',
            color: 'var(--primary-text-color)',
          },
        }}
      >
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
              sx: { color: 'inherit' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={{ color: 'inherit' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveCharacterName} type="submit" sx={{ color: 'inherit' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={settingsDialogOpen}
        onClose={handleToggleSettingsDialog}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--chip-background-color)',
            color: 'var(--primary-text-color)',
          },
        }}
      >
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
                  '!flex !items-center !px-3 !py-1 !rounded-full !transition-all !duration-300 !ease-in-out raid-chip',
                  raidVisibility[index] ? '!bg-primary-background-selection-color !active-raid' : '!bg-chip-background-color',
                  !raidVisibility[index] && '!hover:bg-primary-background-hover-color !hover:scale-105 !cursor-pointer',
                  '!text-white !m-1'
                )}
                variant="outlined"
              />
            ))}
          </div>
          <div className="mt-8">
            <p className="text-sm text-center mb-4">Manage Todo</p>
            <div className="grid grid-cols-1 gap-4">
              <Chip
                label="Chaos Dungeon"
                onClick={() => {
                  setChaosGateVisibility(!chaosGateVisibility);
                  localStorage.setItem('chaosGateVisibility', JSON.stringify(!chaosGateVisibility));
                }}
                className={clsx(
                  '!flex !items-center !px-3 !py-1 !rounded-full !transition-all !duration-300 !ease-in-out raid-chip',
                  chaosGateVisibility ? '!bg-primary-background-selection-color !active-raid' : '!bg-chip-background-color',
                  !chaosGateVisibility && '!hover:bg-primary-background-hover-color !hover:scale-105 !cursor-pointer',
                  '!text-white !m-1'
                )}
                variant="outlined"
              />
              <Chip
                label="Una Task"
                onClick={() => {
                  setUnaTaskVisibility(!unaTaskVisibility);
                  localStorage.setItem('unaTaskVisibility', JSON.stringify(!unaTaskVisibility));
                }}
                className={clsx(
                  '!flex !items-center !px-3 !py-1 !rounded-full !transition-all !duration-300 !ease-in-out raid-chip',
                  unaTaskVisibility ? '!bg-primary-background-selection-color !active-raid' : '!bg-chip-background-color',
                  !unaTaskVisibility && '!hover:bg-primary-background-hover-color !hover:scale-105 !cursor-pointer',
                  '!text-white !m-1'
                )}
                variant="outlined"
              />
              <Chip
                label="Guardian Raid"
                onClick={() => {
                  setGuardianRaidVisibility(!guardianRaidVisibility);
                  localStorage.setItem('guardianRaidVisibility', JSON.stringify(!guardianRaidVisibility));
                }}
                className={clsx(
                  '!flex !items-center !px-3 !py-1 !rounded-full !transition-all !duration-300 !ease-in-out raid-chip',
                  guardianRaidVisibility ? '!bg-primary-background-selection-color !active-raid' : '!bg-chip-background-color',
                  !guardianRaidVisibility && '!hover:bg-primary-background-hover-color !hover:scale-105 !cursor-pointer',
                  '!text-white !m-1'
                )}
                variant="outlined"
              />
              <Chip
                label="Una Weeklies"
                onClick={() => {
                  setGuildWeekliesVisibility(!guildWeekliesVisibility);
                  localStorage.setItem('guildWeekliesVisibility', JSON.stringify(!guildWeekliesVisibility));
                }}
                className={clsx(
                  '!flex !items-center !px-3 !py-1 !rounded-full !transition-all !duration-300 !ease-in-out raid-chip',
                  guildWeekliesVisibility ? '!bg-primary-background-selection-color !active-raid' : '!bg-chip-background-color',
                  !guildWeekliesVisibility && '!hover:bg-primary-background-hover-color !hover:scale-105 !cursor-pointer',
                  '!text-white !m-1'
                )}
                variant="outlined"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleSettingsDialog} sx={{ color: 'inherit' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={additionalGoldDialogOpen}
        onClose={handleCloseAdditionalGoldDialog}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--chip-background-color)',
            color: 'var(--primary-text-color)',
          },
        }}
      >
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
              sx: { color: 'inherit' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdditionalGoldDialog} sx={{ color: 'inherit' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveAdditionalGold} sx={{ color: 'inherit' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmSweepDialogOpen}
        onClose={handleToggleConfirmSweepDialog}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--chip-background-color)',
            color: 'var(--primary-text-color)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)' }}>Reset Raid Data For All Characters</DialogTitle>
        <DialogContent>
          <p>Reset raid data for all characters?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleConfirmSweepDialog} sx={{ color: 'inherit' }}>
            No
          </Button>
          <Button onClick={handleSweepCheckedStates} sx={{ color: 'inherit' }}>
            Yes
          </Button>
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
          [theme.breakpoints.up(640)]: {
            // Directly using 640 pixels as the breakpoint
            marginBottom: '85px', // Applies 85px margin-bottom at 640 pixels width and above
          },
          '.MuiTableCell-root': {
            color: 'var(--primary-text-color)',
            borderBottom: '2px solid var(--primary-text-label-color)',
            paddingLeft: '2px',
            paddingRight: '2px',
          },
          '.MuiSvgIcon-root': {
            color: 'var(--primary-text-label-color)',
          },
          '& tr:nth-of-type(even)': {
            backgroundColor: 'var(--secondary-background-color)'
          }
        })}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className='even-row'>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px' }}></TableCell>
              {[...Array(characterCount)].map((_, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    textAlign: 'center',
                  }}
                >
                  <Button
                    onClick={() => handleOpenEditDialog(index)}
                    sx={{
                      color: 'inherit',
                      fontFamily: 'Inter, sans-serif', // Ensure 'Inter' font is loaded in your project
                      fontSize: '24px',
                      textTransform: 'none', // This prevents the text from being all caps
                    }}
                  >
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
                <TableRow key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      textAlign: 'left',
                      fontSize: '24px',
                      position: 'relative',
                      width: 'fit-content',
                      flexShrink: 0,
                      minWidth: '150px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        key={groupedRaids[0].path}
                        src={groupedRaids[0].imgSrc}
                        alt={groupedRaids[0].label}
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div className="shrink-0">{label}</div>
                    </div>
                  </TableCell>
                  {[...Array(characterCount)].map((_, characterIndex) => (
                    <TableCell key={characterIndex} sx={{ textAlign: 'center' }}>
                      <FormGroup row className="justify-center">
                        {groupedRaids.map((raid: Raid) => {
                          return (
                            <div key={raid.path} className="min-w-36 text-left">
                              <IconButton onClick={() => handleToggle(raid.path)} size="small">
                                <ExpandMoreIcon />
                              </IconButton>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checkedStates[characterIndex]?.[raid.path]?.every(Boolean) || false}
                                    indeterminate={
                                      checkedStates[characterIndex]?.[raid.path]?.some(Boolean) &&
                                      !checkedStates[characterIndex]?.[raid.path]?.every(Boolean)
                                    }
                                    onChange={() => handleMainCheckboxChange(raid.path, characterIndex)}
                                  />
                                }
                                label={raid.path.endsWith('-hard') ? 'Hard' : raid.path.endsWith('-solo') ? 'Solo' : 'Normal'}
                                sx={{ textAlign: 'center' }} // Center the labels
                              />
                              <Collapse in={open[raid.path]} timeout="auto" unmountOnExit>
                                <div style={{ marginLeft: '40px' }}>
                                  {raid.gateData.gold.map((_, gateIndex: number) => (
                                    <div key={`${raid.path}-gold-${gateIndex}`}>
                                      <FormControlLabel
                                        className="flex justify-center items-center"
                                        control={
                                          <Checkbox
                                            checked={checkedStates[characterIndex]?.[raid.path]?.[gateIndex] || false}
                                            onChange={() => handleGateCheckboxChange(raid.path, characterIndex, gateIndex)}
                                            className="flex justify-center items-center"
                                          />
                                        }
                                        label={`Gate ${gateIndex + 1}`}
                                        style={{ display: 'flex' }}
                                      />
                                      <Tooltip title="Chest" placement="top" key={`${raid.path}-gate-${gateIndex}-boxCostTooltip`}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={boxCheckedStates[characterIndex]?.[raid.path]?.[gateIndex] || false}
                                              onChange={() => handleBoxCheckboxChange(raid.path, characterIndex, gateIndex)}
                                              className="flex justify-center items-center"
                                            />
                                          }
                                          className="flex justify-center items-center"
                                          label={<FontAwesomeIcon icon={faBriefcase} size="xs" className="text-image-sun-color" />}
                                        />
                                      </Tooltip>
                                    </div>
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
              <TableCell
                component="th"
                scope="row"
                sx={{
                  textAlign: 'left',
                  fontSize: '24px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <div className="flex flex-row">
                  <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '40px', verticalAlign: 'middle' }} />
                  Extra Gold
                </div>
              </TableCell>
              {[...Array(characterCount)].map((_, index) => (
                <TableCell key={index} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginRight: '28px',
                    }}
                  >
                    <IconButton onClick={() => handleOpenAdditionalGoldDialog(index)}>
                      <EditIcon />
                    </IconButton>
                    {additionalGold[index].toLocaleString()}
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginLeft: '5px' }} />
                  </span>
                </TableCell>
              ))}
            </TableRow>
            {chaosGateVisibility && (
              <TableRow>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  <div className="flex items-center">
                    <BalconyIcon sx={{ marginRight: '8px', fontSize: '40px', '& path': { fill: 'var(--primary-text-color)' } }} />
                    Chaos Dungeon
                  </div>
                </TableCell>
                {[...Array(characterCount)].map((_, index) => (
                  <TableCell key={index} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                    <StyledRating
                      name={`chaos-gate-${index}`}
                      value={chaosGateRatings[index]}
                      onChange={(event, newValue) => {
                        const newRatings = [...chaosGateRatings];
                        newRatings[index] = newValue || 0;
                        setChaosGateRatings(newRatings);
                        localStorage.setItem('chaosGateRatings', JSON.stringify(newRatings));
                      }}
                      max={1}
                      icon={<BalconyIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color)' } }} />}
                      emptyIcon={<BalconyIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color-opacity)' } }} />}
                    />
                  </TableCell>
                ))}
              </TableRow>
            )}
            {unaTaskVisibility && (
              <TableRow>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  <div className="flex items-center">
                    <TaskAltIcon sx={{ marginRight: '8px', fontSize: '40px', '& path': { fill: 'var(--primary-text-color)' } }} />
                    Una Tasks
                  </div>
                </TableCell>
                {[...Array(characterCount)].map((_, index) => (
                  <TableCell key={index} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                    <StyledRating
                      name={`una-task-${index}`}
                      value={unaTaskRatings[index]}
                      onChange={(event, newValue) => {
                        const newRatings = [...unaTaskRatings];
                        newRatings[index] = newValue || 0;
                        setUnaTaskRatings(newRatings);
                        localStorage.setItem('unaTaskRatings', JSON.stringify(newRatings));
                      }}
                      max={3}
                      icon={<TaskAltIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color)' } }} />}
                      emptyIcon={<TaskAltIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color-opacity)' } }} />}
                    />
                  </TableCell>
                ))}
              </TableRow>
            )}
            {guildWeekliesVisibility && (
              <TableRow>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  <div className="flex items-center">
                    <PeopleIcon sx={{ marginRight: '8px', fontSize: '40px', '& path': { fill: 'var(--primary-text-color)' } }} />
                    Una Weeklies
                  </div>
                </TableCell>
                {[...Array(characterCount)].map((_, index) => (
                  <TableCell key={index} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                    <StyledRating
                      name={`guild-weeklies-${index}`}
                      value={guildWeekliesRatings[index]}
                      onChange={(event, newValue) => {
                        const newRatings = [...guildWeekliesRatings];
                        newRatings[index] = newValue || 0;
                        setGuildWeekliesRatings(newRatings);
                        localStorage.setItem('guildWeekliesRatings', JSON.stringify(newRatings));
                      }}
                      max={3}
                      icon={<PeopleIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color)' } }} />}
                      emptyIcon={<PeopleIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color-opacity)' } }} />}
                    />
                  </TableCell>
                ))}
              </TableRow>
            )}
            {guardianRaidVisibility && (
              <TableRow>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                  <div className="flex items-center">
                    <PestControlIcon sx={{ marginRight: '8px', fontSize: '40px', '& path': { fill: 'var(--primary-text-color)' } }} />
                    Guardian Raid
                  </div>
                </TableCell>
                {[...Array(characterCount)].map((_, index) => (
                  <TableCell key={index} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                    <StyledRating
                      name={`guardian-raid-${index}`}
                      value={guardianRaidRatings[index]}
                      onChange={(event, newValue) => {
                        const newRatings = [...guardianRaidRatings];
                        newRatings[index] = newValue || 0;
                        setGuardianRaidRatings(newRatings);
                        localStorage.setItem('guardianRaidRatings', JSON.stringify(newRatings));
                      }}
                      max={1}
                      icon={<PestControlIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color)' } }} />}
                      emptyIcon={<PestControlIcon fontSize="inherit" sx={{ '& path': { fill: 'var(--primary-text-color-opacity)' } }} />}
                    />
                  </TableCell>
                ))}
              </TableRow>
            )}
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

export default CharacterGrid;
