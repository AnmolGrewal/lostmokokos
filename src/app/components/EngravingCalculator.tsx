/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, Chip, Slider, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Tab, Tabs } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { engravings, engravingItems, negativeEngravings } from '../../data/engravings';
import EngravingGrid from './EngravingGrid';
import ClearDialog from './ClearDialog';
import { ToastContainer, toast } from 'react-toastify';
import imagesData from '../../data/imageLinks';
import 'react-toastify/dist/ReactToastify.css';

interface Engravings {
  selectedEngravings: string[];
  accessoryEngravings: string[][];
  accessoryLevels: number[][];
  totalEngravings: { [key: string]: number };
  goldCost: number[];
}

interface Preset {
  name: string;
  index: number;
  engravings: Engravings;
  totalGoldCost?: number;
}

const EngravingCalculator: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [selectedEngravings, setSelectedEngravings] = useState<string[]>([]);
  const [accessoryEngravings, setAccessoryEngravings] = useState<string[][]>([]);
  const [accessoryLevels, setAccessoryLevels] = useState<number[][]>([]);
  const [totalEngravings, setTotalEngravings] = useState<{ [key: string]: number }>({});
  const [goldCost, setGoldCost] = useState<number[]>([]);
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState<boolean>(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState<boolean>(false);
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [optimizerValues, setOptimizerValues] = useState<{ [key: string]: number }>({});
  const [combinations, setCombinations] = useState<EngravingItem[][]>([]);
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(0);
  const accessoryOrder = ['Books', 'Ability Stone', 'Necklace', 'Earring', 'Earring', 'Ring', 'Ring'];

  const handleOptimizerSliderChange = (engraving: string, value: number | number[]) => {
    setOptimizerValues((prevValues) => ({
      ...prevValues,
      [engraving]: (value as number),
    }));
  };

  const addNewPreset = useCallback(() => {
    const newIndex = presets.length > 0 ? Math.max(...presets.map(p => p.index)) + 1 : 1;
    const newPresetName = `Preset ${newIndex}`;
    const newPreset: Preset = {
      name: newPresetName,
      index: newIndex,
      engravings: {
        selectedEngravings: [],
        accessoryEngravings: [],
        accessoryLevels: [],
        totalEngravings: {},
        goldCost: [],
      },
    };
    setPresets([...presets, newPreset]);
    setSelectedPreset(newPresetName);
    loadEngravings(newPreset.engravings);
  }, [presets]);

  const handlePresetChange = useCallback((event: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setSelectedPreset(value);
      const preset = presets.find((preset) => preset.name === value);
      if (preset) {
        loadEngravings(preset.engravings);
      } else if (value === 'Add New Preset') {
        addNewPreset();
      }
    }
  }, [presets, addNewPreset]);

  useEffect(() => {
    const loadPresets = () => {
      const savedPresets = localStorage.getItem('presets');
      if (savedPresets) {
        const parsedPresets: Preset[] = JSON.parse(savedPresets);
        setPresets(parsedPresets);
        if (parsedPresets.length > 0) {
          setSelectedPreset(parsedPresets[0].name);
          loadEngravings(parsedPresets[0].engravings);
        }
      } else {
        const defaultPreset: Preset = {
          name: 'Default',
          index: 1,
          engravings: {
            selectedEngravings: [],
            accessoryEngravings: [],
            accessoryLevels: [],
            totalEngravings: {},
            goldCost: [],
          },
        };
        setPresets([defaultPreset]);
        setSelectedPreset(defaultPreset.name);
        loadEngravings(defaultPreset.engravings);
      }
    };

    loadPresets();
  }, []);

  useEffect(() => {
    const savePresets = () => {
      localStorage.setItem('presets', JSON.stringify(presets));
    };

    savePresets();
  }, [presets]);

  const loadEngravings = (engravings: Engravings) => {
    setSelectedEngravings(engravings.selectedEngravings || []);
    setAccessoryEngravings(engravings.accessoryEngravings || Array(7).fill(Array(3).fill('')));
    setAccessoryLevels(engravings.accessoryLevels || Array(7).fill(Array(3).fill(0)));
    setTotalEngravings(engravings.totalEngravings || {});
    setGoldCost(engravings.goldCost || Array(7).fill(0));
  };
  

  const handleEngravingChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    const deletedEngravings = selectedEngravings.filter((engraving) => !value.includes(engraving));

    const newAccessoryEngravings = accessoryEngravings.map((engravingList) =>
      engravingList.map((engraving) => (deletedEngravings.includes(engraving) ? '' : engraving))
    );
    const newAccessoryLevels = accessoryLevels.map((levelList, accessoryIndex) =>
      levelList.map((level, engravingIndex) =>
        deletedEngravings.includes(accessoryEngravings[accessoryIndex][engravingIndex]) ? 0 : level
      )
    );

    setSelectedEngravings(value);
    setAccessoryEngravings(newAccessoryEngravings);
    setAccessoryLevels(newAccessoryLevels);

    updateCurrentPreset({
      selectedEngravings: value,
      accessoryEngravings: newAccessoryEngravings,
      accessoryLevels: newAccessoryLevels,
      totalEngravings,
      goldCost: {...goldCost},
    });
  };

  const handleAccessoryEngravingChange = (accessoryIndex: number, engravingIndex: number) => (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const newAccessoryEngravings = [...accessoryEngravings];
    const newAccessoryLevels = [...accessoryLevels];
    const newGoldCost = [...goldCost];
  
    newAccessoryEngravings[accessoryIndex][engravingIndex] = value || '';
  
    // Set the engraving level to the minimum level of the corresponding engravingItem
    if (value) {
      const engravingItem = engravingItems.find((item) => item.label === accessoryOrder[accessoryIndex]);
      if (engravingItem) {
        newAccessoryLevels[accessoryIndex][engravingIndex] = Math.min(...engravingItem.values[engravingIndex]);
      }
    } else {
      newAccessoryLevels[accessoryIndex][engravingIndex] = 0;
    }
  
    setAccessoryEngravings(newAccessoryEngravings);
    setAccessoryLevels(newAccessoryLevels);
  
    const newTotalEngravings = calculateTotalEngravings(newAccessoryEngravings, newAccessoryLevels);
    setTotalEngravings(newTotalEngravings);
  
    updateCurrentPreset({
      selectedEngravings,
      accessoryEngravings: newAccessoryEngravings,
      accessoryLevels: newAccessoryLevels,
      totalEngravings: newTotalEngravings,
      goldCost: newGoldCost,
    });
  };  

  const handleAccessoryLevelChange = (accessoryIndex: number, engravingIndex: number) => (event: Event, value: number | number[]) => {
    const newAccessoryLevels = [...accessoryLevels];
    newAccessoryLevels[accessoryIndex][engravingIndex] = value as number;
    setAccessoryLevels(newAccessoryLevels);

    const newTotalEngravings = calculateTotalEngravings(accessoryEngravings, newAccessoryLevels);
    setTotalEngravings(newTotalEngravings);

    updateCurrentPreset({
      selectedEngravings,
      accessoryEngravings,
      accessoryLevels: newAccessoryLevels,
      totalEngravings: newTotalEngravings,
      goldCost: [...goldCost],
    });
  };

  const calculateTotalEngravings = (engravings: string[][], levels: number[][]) => {
    const newTotalEngravings: { [key: string]: number } = {};

    engravings.forEach((accessoryEngravings, accessoryIndex) => {
      accessoryEngravings.forEach((engraving, engravingIndex) => {
        if (engraving) {
          const level = levels[accessoryIndex][engravingIndex];
          newTotalEngravings[engraving] = (newTotalEngravings[engraving] || 0) + level;
        }
      });
    });

    return newTotalEngravings;
  };

  const updateCurrentPreset = (engravings: Engravings) => {
    const updatedPresets = presets.map((preset) => {
      if (preset.name === selectedPreset) {
        return {
          ...preset,
          engravings,
        };
      }
      return preset;
    });
    setPresets(updatedPresets);
  };  

  const handleToggleConfirmClearDialog = () => {
    setConfirmClearDialogOpen(!confirmClearDialogOpen);
  };

  const handleClearAllDataConfirmed = () => {
    setSelectedEngravings([]);
    setAccessoryEngravings([]);
    setAccessoryLevels([]);
    setTotalEngravings({});
    updateCurrentPreset({
      selectedEngravings: [],
      accessoryEngravings: [],
      accessoryLevels: [],
      totalEngravings: {},
      goldCost: [],
    });
    handleToggleConfirmClearDialog();
  };

  const handleToggleConfirmDeleteDialog = (presetName: string) => {
    setPresetToDelete(presetName);
    setConfirmDeleteDialogOpen(!confirmDeleteDialogOpen);
  };

  const handleDeletePresetConfirmed = () => {
    if (presetToDelete) {
      const updatedPresets = presets.filter((preset) => preset.name !== presetToDelete);
      setPresets(updatedPresets);
      if (updatedPresets.length > 0) {
        setSelectedPreset(updatedPresets[0].name);
        loadEngravings(updatedPresets[0].engravings);
      } else {
        const defaultPreset: Preset = {
          name: 'Default',
          index: 1,
          engravings: {
            selectedEngravings: [],
            accessoryEngravings: [],
            accessoryLevels: [],
            totalEngravings: {},
            goldCost: [],
          },
        };
        setPresets([defaultPreset]);
        setSelectedPreset(defaultPreset.name);
        loadEngravings(defaultPreset.engravings);
      }
      handleToggleConfirmDeleteDialog('');
    }
  };

  const handleGoldCostChange = (accessoryIndex: number, value: number) => {
    const updatedPresets = presets.map((preset) => {
      if (preset.name === selectedPreset) {
        const updatedGoldCost = Array.isArray(preset.engravings.goldCost)
          ? [...preset.engravings.goldCost]
          : Array(7).fill(0);
        
        // Ensure that the value is a valid number
        const parsedValue = isNaN(value) ? 0 : value;
        updatedGoldCost[accessoryIndex] = parsedValue;
  
        // Calculate the total gold cost by summing up all the gold costs
        const totalGoldCost = updatedGoldCost.reduce((sum, cost) => {
          // Ensure that each cost is a valid number
          const parsedCost = isNaN(cost) ? 0 : cost;
          return sum + parsedCost;
        }, 0);
        console.log('totalGoldCost', totalGoldCost);
        return {
          ...preset,
          engravings: {
            ...preset.engravings,
            goldCost: updatedGoldCost,
          },
          totalGoldCost,
        };
      }
      return preset;
    });
    setPresets(updatedPresets);
  };  

  const renderAccessoryRows = () => {
    const accessoryRows = [];

    for (let i = 0; i < accessoryOrder.length; i++) {
      const accessory = accessoryOrder[i];
      const accessoryData = engravingItems.find((item) => item.label === accessory);

      const renderAccessory = (accessoryData: typeof engravingItems[0] | undefined, accessoryIndex: number) => {
        if (!accessoryData) return null;

        if (!accessoryEngravings[accessoryIndex]) {
          accessoryEngravings[accessoryIndex] = Array(accessoryData.values.length).fill('');
        }
        if (!accessoryLevels[accessoryIndex]) {
          accessoryLevels[accessoryIndex] = Array(accessoryData.values.length).fill(0);
        }

        const currentPreset = presets.find((preset) => preset.name === selectedPreset);
        if (!currentPreset) return null;

        return (
          <div key={accessoryIndex} className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
            <div className="flex items-center space-x-4 justify-between">
              <div className="flex items-center space-x-4">
                <img src={accessoryData.image} alt={accessoryData.label} className="w-10 h-10 flex-shrink-0" />
                <span className="text-lg text-primary-text-color min-w-fit flex-shrink-0 accessory-label">{accessoryData.label}</span>
              </div>
              <div className="flex items-center">
                <img src={imagesData.goldCoins} alt="Gold Coins" style={{ width: '20px', marginRight: '5px' }} />
                <input
                  type="number"
                  min="0"
                  value={currentPreset.engravings.goldCost[accessoryIndex] || ''}
                  onChange={(e) => handleGoldCostChange(accessoryIndex, parseInt(e.target.value) || 0)}
                  className="bg-primary-background-color text-primary-text-color px-2 py-1 rounded w-24 text-right"
                />
              </div>
            </div>
            <div className="accessory-row">
              {accessoryData.values.map((values, engravingIndex) => (
                <div key={engravingIndex} className="flex flex-col mt-4 flex-1">
                  <Autocomplete
                    options={
                      accessoryData.label === 'Ability Stone'
                        ? selectedEngravings.filter((engraving) => !engravings.find((e) => e.label === engraving)?.isClassEngraving)
                        : engravingIndex === 2
                          ? negativeEngravings.map((engraving) => engraving.label)
                          : selectedEngravings
                    }
                    value={accessoryEngravings[accessoryIndex][engravingIndex] || null}
                    onChange={handleAccessoryEngravingChange(accessoryIndex, engravingIndex)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Engraving ${engravingIndex + 1}`}
                        InputLabelProps={{
                          style: { color: 'var(--primary-text-label-color)', width: 'w-full' },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            color: 'var(--primary-text-color)',
                            backgroundColor: 'var(--primary-background-color)',
                          },
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    sx={{
                      '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
                        color: 'var(--primary-text-label-color)',
                      },
                    }}
                  />
                  {accessoryEngravings[accessoryIndex][engravingIndex] && (
                    <>
                      {values.length > 1 ? (
                        <div className="flex items-center justify-center mt-2 flex-col">
                          <Slider
                            value={accessoryLevels[accessoryIndex][engravingIndex]}
                            onChange={handleAccessoryLevelChange(accessoryIndex, engravingIndex)}
                            min={Math.min(...values)}
                            max={Math.max(...values)}
                            step={null}
                            marks={values.map((value) => ({ value, label: '' }))}
                            valueLabelDisplay="auto"
                            className="w-11/12"
                            sx={{
                              color: 'var(--primary-text-color)',
                              '& .MuiSlider-rail': {
                                backgroundColor: 'var(--primary-background-color)',
                              },
                              '& .MuiSlider-track': {
                                backgroundColor: 'var(--secondary-background-color)',
                              },
                              '& .MuiSlider-thumb': {
                                backgroundColor: 'var(--primary-text-color)',
                              },
                            }}
                          />
                          <div className="text-center text-primary-text-label-color mt-1">
                            {accessoryLevels[accessoryIndex][engravingIndex]}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-primary-text-label-color mt-5 text-2xl">
                          {accessoryLevels[accessoryIndex][engravingIndex]}
                        </div>
                      )}
                    </>                  
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      };

      accessoryRows.push(
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAccessory(accessoryData, i)}
          {i + 1 < accessoryOrder.length && renderAccessory(engravingItems.find((item) => item.label === accessoryOrder[i + 1]), i + 1)}
        </div>
      );
      i++; // Increment i to skip the next accessory since it's already rendered
    }

    // Add the Total Engravings section to the last column of the last row
    if (accessoryRows.length > 0) {
      const lastRow = accessoryRows[accessoryRows.length - 1];
      accessoryRows[accessoryRows.length - 1] = (
        <div key={lastRow.key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lastRow.props.children}
          <div className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
            <h2 className="text-primary-text-color text-2xl text-center">Total Engravings</h2>
            <div className="flex flex-wrap justify-center">
              {renderTotalEngravings()}
            </div>
          </div>
        </div>
      );
    }

    return accessoryRows;
  };

  const calculateTotalEngravingSummary = (totalEngravings: { [key: string]: number }) => {
    const engravingCounts: { [key: string]: number } = {};

    // eslint-disable-next-line no-unused-vars
    Object.entries(totalEngravings).forEach(([label, total]) => {
      const count = Math.floor(total / 5);
      if (count > 0) {
        engravingCounts[count.toString()] = (engravingCounts[count.toString()] || 0) + 1;
      }
    });

    const summary = Object.entries(engravingCounts)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([count, quantity]) => `${quantity}x${count}`)
      .join(' + ');

    return summary;
  };

  const renderTotalEngravings = () => {
    const currentPreset = presets.find((preset) => preset.name === selectedPreset);
    if (!currentPreset) return null;

    const totalEngravingSummary = calculateTotalEngravingSummary(currentPreset.engravings.totalEngravings);

    return (
      <>
        <div className="flex flex-col">
          <div className="flex flex-wrap justify-center">
            {Object.entries(currentPreset.engravings.totalEngravings).map(([label, total], index) => (
              <div key={index} className="flex flex-col items-center justify-center p-2 border border-primary-text-color bg-primary-background-color rounded-lg m-2">
                <span className="text-primary-text-color">{label}</span>
                <span className="text-primary-text-color">{total}</span>
              </div>
            ))}
          </div>
          {totalEngravingSummary && (
            <div className="text-primary-text-color text-center mt-4 text-2xl">Engravings: {totalEngravingSummary}</div>
          )}
        </div>
      </>
    );
  };

  const calculateRemainingValues = () => {
    const remainingValues: { [key: string]: number } = {};
  
    selectedEngravings.forEach((engraving) => {
      const desiredValue = optimizerValues[engraving] || 0;
      const currentValue = totalEngravings[engraving] || 0;
      const remaining = (desiredValue * 5) - currentValue;
      remainingValues[engraving] = remaining > 0 ? remaining : 0;
    });
  
    return remainingValues;
  };

  const calculateRemainingValuesMap = () => {
    const remainingValues = new Map<string, number>();
  
    selectedEngravings.forEach((engraving) => {
      const desiredValue = optimizerValues[engraving] || 0;
      const currentValue = totalEngravings[engraving] || 0;
      const remaining = (desiredValue * 5) - currentValue;
      // if(remaining > 0) {
      remainingValues.set(engraving, remaining);
      // }
    });
  
    return remainingValues;
  }; 

  interface EngravingItem {
    label: string;
    firstEngraving: string;
    secondEngraving: string;
    firstEngravingValue: number;
    secondEngravingValue: number;
    firstEngravingMaxValue: number;
    secondEngravingMaxValue: number;
    isFixed: boolean;
  }

  const findCombinationNeeded = () => {
    const remainingValues = calculateRemainingValuesMap();
    const combinationNeeded: EngravingItem[] = new Array(7).fill(null).map(() => ({
      label: '',
      firstEngraving: '',
      secondEngraving: '',
      firstEngravingValue: 0,
      secondEngravingValue: 0,
      firstEngravingMaxValue: 0,
      secondEngravingMaxValue: 0,
      isFixed: false,
    }));
  
    // Create a mapping of accessory index to accessory data
    const accessoryMapping = [
      { label: 'Books', maxValues: [12, 12], fixedValues: [3, 6, 9, 12] },
      { label: 'Ability Stone', maxValues: [10, 10] },
      { label: 'Necklace', maxValues: [6, 3] },
      { label: 'Earring 1', maxValues: [6, 3] },
      { label: 'Earring 2', maxValues: [6, 3] },
      { label: 'Ring 1', maxValues: [6, 3] },
      { label: 'Ring 2', maxValues: [6, 3] },
    ];
  
    accessoryLevels.forEach((engravingLevels, index) => {
      const accessoryData = accessoryMapping[index];
      const engravingData = accessoryEngravings[index];
      combinationNeeded[index].label = accessoryData.label;
      combinationNeeded[index].firstEngraving = engravingData[0];
      combinationNeeded[index].secondEngraving = engravingData[1];
      combinationNeeded[index].firstEngravingValue = engravingLevels[0];
      combinationNeeded[index].secondEngravingValue = engravingLevels[1];
      combinationNeeded[index].firstEngravingMaxValue = accessoryData.maxValues[0];
      combinationNeeded[index].secondEngravingMaxValue = accessoryData.maxValues[1];
      if (combinationNeeded[index].firstEngravingValue > 0 || combinationNeeded[index].secondEngravingValue > 0) {
        combinationNeeded[index].isFixed = true;
      }
    });
  
    const nonFixedAccessories = combinationNeeded.filter((accessory) => !accessory.isFixed);
  
    const memo = new Map<string, boolean>();
    const MAX_DEPTH = 5;
    const MAX_COMBINATIONS = 50;
    const combinations: EngravingItem[][] = [];
  
    const serializeState = (index: number, remainingValues: Map<string, number>): string => {
      const remainingArray = Array.from(remainingValues.entries()).sort().map(([key, value]) => `${key}:${value}`).join(',');
      return `${index}:${remainingArray}`;
    };
  
    const generateCombinations = (engravings: string[], minSize: number, maxSize: number): string[][] => {
      const result: string[][] = [];
  
      const generatePermutations = (permutation: string[]) => {
        if (permutation.length >= minSize && permutation.length <= maxSize) {
          result.push(permutation);
        }
  
        for (let i = 0; i < engravings.length; i++) {
          if (!permutation.includes(engravings[i])) {
            generatePermutations([...permutation, engravings[i]]);
          }
        }
      };
  
      generatePermutations([]);
      return result;
    };
  
    const backtrack = (index: number, currentRemainingValues: Map<string, number>, depth: number): void => {
      if (Array.from(currentRemainingValues.values()).every(value => value <= 0)) {
        combinations.push(combinationNeeded.map(item => ({ ...item })));
        if (combinations.length >= MAX_COMBINATIONS) {
          return;
        }
      }
      if (index >= nonFixedAccessories.length || depth >= MAX_DEPTH) {
        return;
      }
  
      const stateKey = serializeState(index, currentRemainingValues);
      if (memo.has(stateKey)) {
        return;
      }
  
      const accessory = nonFixedAccessories[index];
  
      const remainingEngravings = Array.from(currentRemainingValues.keys()).filter(engraving => currentRemainingValues.get(engraving)! > 0);
  
      const combinationOptions = generateCombinations(remainingEngravings, 1, 2);
  
      for (const combination of combinationOptions) {
        const [firstEngraving, secondEngraving] = combination;
        accessory.firstEngraving = firstEngraving;
        accessory.secondEngraving = secondEngraving || '';
  
        if (accessory.label === 'Books') {
          const fixedValues = accessoryMapping[0].fixedValues!;
          for (const value of fixedValues) {
            const newRemainingValues = new Map(currentRemainingValues);
            const firstRemaining = (newRemainingValues.get(firstEngraving) || 0) - value;
            newRemainingValues.set(firstEngraving, firstRemaining);
            accessory.firstEngravingValue = value;
  
            if (secondEngraving) {
              const secondRemaining = (newRemainingValues.get(secondEngraving) || 0) - value;
              newRemainingValues.set(secondEngraving, secondRemaining);
              accessory.secondEngravingValue = value;
            } else {
              accessory.secondEngravingValue = 0;
            }
  
            backtrack(index + 1, newRemainingValues, depth + 1);
          }
        } else {
          for (let i = 3; i <= accessory.firstEngravingMaxValue; i++) {
            const newRemainingValues = new Map(currentRemainingValues);
            const firstRemaining = (newRemainingValues.get(firstEngraving) || 0) - i;
            newRemainingValues.set(firstEngraving, firstRemaining);
            accessory.firstEngravingValue = i;
  
            if (secondEngraving) {
              for (let j = 3; j <= accessory.secondEngravingMaxValue; j++) {
                const secondRemaining = (newRemainingValues.get(secondEngraving) || 0) - j;
                newRemainingValues.set(secondEngraving, secondRemaining);
                accessory.secondEngravingValue = j;
  
                backtrack(index + 1, newRemainingValues, depth + 1);
              }
            } else {
              accessory.secondEngravingValue = 0;
              backtrack(index + 1, newRemainingValues, depth + 1);
            }
          }
        }
      }
  
      memo.set(stateKey, true);
    };
  
    const initialRemainingValues = new Map(remainingValues);
    backtrack(0, initialRemainingValues, 0);

    if(combinations.length == 0) {
      toast.error('Combination Not Found', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        style: {
          backgroundColor: 'var(--primary-background-color)',
          color: 'var(--primary-text-color)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          fontSize: '16px',
          padding: '12px',
        },
      });
    }

    return combinations;
  };

  const handleCalculateCombinations = () => {
    const calculatedCombinations = findCombinationNeeded();
    setCombinations(calculatedCombinations);
    setCurrentCombinationIndex(0);
  };

  const handlePreviousCombination = () => {
    setCurrentCombinationIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    console.log(currentCombinationIndex);
  };

  const handleNextCombination = () => {
    setCurrentCombinationIndex((prevIndex) => Math.min(prevIndex + 1, combinations.length - 1));
    console.log(currentCombinationIndex);
  };

  const renderRemainingValues = () => {
    const remainingValues = calculateRemainingValues();
    console.log(combinations)
  
    return (
      <div className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
        <h2 className="text-primary-text-color text-2xl text-center">Combination Needed</h2>
        <div className="flex flex-wrap justify-center">
          {Object.entries(remainingValues).map(([label, remaining], index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2 border border-primary-text-color bg-primary-background-color rounded-lg m-2">
              <span className="text-primary-text-color font-bold">{label}</span>
              <span className="text-primary-text-color">{remaining > 0 ? remaining : 'Achieved'}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex align-center justify-center">
          <button
            className="bg-primary-background-color text-primary-text-color px-4 py-2 rounded items-center font-bold"
            onClick={handleCalculateCombinations}
          >
            Calculate Combinations
          </button>
        </div>
        {combinations.length > 0 && (
          <div className="mt-4">
            <h3 className="text-primary-text-color text-xl text-center">Combination Details</h3>
            <div
              className="flex flex-wrap justify-center"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  handlePreviousCombination();
                } else if (e.key === 'ArrowRight') {
                  handleNextCombination();
                }
              }}
            >
              {combinations[currentCombinationIndex].map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center p-2 border ${
                    item.isFixed ? 'border-image-calendar-color bg-image-calendar-color' : 'border-primary-text-color bg-primary-background-color'
                  } rounded-lg m-2`}
                >
                  <span className={`${item.isFixed ? 'text-primary-background-color' : 'text-primary-text-color'} font-bold`}>
                    {item.label}
                  </span>
                  {item.firstEngraving && (
                    <div className="flex items-center">
                      <span className={item.isFixed ? 'text-primary-background-color' : 'text-primary-text-color'}>
                        {item.firstEngraving}:
                      </span>
                      <span className={`${item.isFixed ? 'text-primary-background-color' : 'text-primary-text-color'} ml-1`}>
                        {item.firstEngravingValue}
                      </span>
                    </div>
                  )}
                  {item.secondEngraving && (
                    <div className="flex items-center">
                      <span className={item.isFixed ? 'text-primary-background-color' : 'text-primary-text-color'}>
                        {item.secondEngraving}:
                      </span>
                      <span className={`${item.isFixed ? 'text-primary-background-color' : 'text-primary-text-color'} ml-1`}>
                        {item.secondEngravingValue}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-primary-background-color text-primary-text-color px-4 py-2 rounded mr-2"
                onClick={handlePreviousCombination}
                disabled={currentCombinationIndex === 0}
              >
                Previous
              </button>
              <span className="text-primary-text-color mx-2 flex items-center">
                {currentCombinationIndex + 1} / {combinations.length}
              </span>
              <button
                className="bg-primary-background-color text-primary-text-color px-4 py-2 rounded"
                onClick={handleNextCombination}
                disabled={currentCombinationIndex === combinations.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };  

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const renderOptimizer = () => {
    return (
      <div className="mt-4">
        <h1 className="text-primary-text-label-color text-center text-2xl">
          Please Set Books and Ability Stone Before Using this as it does tens of thousands of combinations!
          <br />
          Pre Release Alpha Version!
          <br />
          Works Better when you select at least 5 level 3s
        </h1>
        <div className="bg-secondary-background-color p-4 mt-4 rounded-lg grid md:grid-cols-3 gap-4 grid-cols-2">
          {selectedEngravings.map((engraving, index) => (
            <div key={index} className="flex flex-col items-center mb-4 mx-2">
              <span className="text-primary-text-color text-lg">{engraving}</span>
              <Slider
                value={optimizerValues[engraving] || 0}
                onChange={(event, value) => handleOptimizerSliderChange(engraving, value)}
                min={0}
                max={3}
                step={1}
                marks={[
                  { value: 0, label: '' },
                  { value: 1, label: '' },
                  { value: 2, label: '' },
                  { value: 3, label: '' },
                ]}
                valueLabelDisplay="auto"
                className="w-11/12"
                sx={{
                  color: 'var(--primary-text-color)',
                  '& .MuiSlider-rail': {
                    backgroundColor: 'var(--primary-background-color)',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'var(--secondary-background-color)',
                  },
                  '& .MuiSlider-thumb': {
                    backgroundColor: 'var(--primary-text-color)',
                  },
                }}
              />
              <div className="text-center text-primary-text-label-color mt-1">
                Level: {optimizerValues[engraving] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-primary-background-color p-4 size-full flex flex-1 flex-shrink-0 flex-col justify-center">
      <div className="bg-secondary-background-color p-4 rounded-lg mt-4 flex flex-1 flex-shrink-0 flex-row justify-center align-middle items-center">
        <Autocomplete
          options={[...presets.map((preset) => preset.name), 'Add New Preset']}
          value={selectedPreset || null}
          onChange={handlePresetChange}
          isOptionEqualToValue={(option, value) => option === value}
          className="w-full mr-2 min-h-[60px] flex flex-1 flex-shrink-0 flex-row justify-center align-middle items-center"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Preset"
              InputLabelProps={{
                style: { color: 'var(--primary-text-label-color)' },
              }}
              InputProps={{
                ...params.InputProps,
                style: {
                  color: 'var(--primary-text-color)',
                  backgroundColor: 'var(--primary-background-color)',
                  minHeight: '60px',
                },
              }}
            />
          )}
          sx={{
            '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
              color: 'var(--primary-text-label-color)',
            },
          }}
        />
        {selectedPreset !== 'Default' && (
          <IconButton
            onClick={() => handleToggleConfirmDeleteDialog(selectedPreset)}
            size="small"
            sx={{
              color: 'var(--primary-text-color)',
              bgcolor: 'var(--image-background-color)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              p: '5px',
              '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
      <div className="bg-secondary-background-color p-4 rounded-lg mt-4 flex flex-1 flex-shrink-0 flex-row justify-center align-middle items-center">
        <Autocomplete
          multiple
          options={engravings.map((engraving) => engraving.label)}
          value={selectedEngravings}
          className="w-full mr-2 min-h-[60px] flex flex-1 flex-shrink-0 flex-row justify-center align-middle items-center"
          onChange={handleEngravingChange}
          isOptionEqualToValue={(option, value) => option === value}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option}
                  {...tagProps}
                  className="!bg-chip-background-color !text-chip-text-color !text-lg !mr-2 !mt-2"
                  deleteIcon={<DeleteIcon style={{ color: 'var(--primary-text-label-color)' }} />}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Engravings"
              InputLabelProps={{
                style: { color: 'var(--primary-text-label-color)' },
              }}
              InputProps={{
                ...params.InputProps,
                style: {
                  color: 'var(--primary-text-color)',
                  backgroundColor: 'var(--primary-background-color)',
                  minHeight: '60px',
                },
                endAdornment: <>{params.InputProps.endAdornment}</>,
              }}
            />
          )}
          sx={{
            '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
              color: 'var(--primary-text-label-color)',
            },
          }}
        />
        <IconButton
          onClick={handleToggleConfirmClearDialog}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            p: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="Accessory and Grid Tabs"
        className='mt-4 flex justify-center items-center'
        sx={{
          '& .MuiTab-root': {
            color: 'var(--primary-text-label-color)',
            fontSize: '24px',
          },
          '& .Mui-selected': {
            color: 'var(--primary-text-label-color)',
            fontWeight: 'bold',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--primary-text-label-color)',
          },
        }}
      >
        <Tab label="Accessories" />
        <Tab label="Grid" />
        <Tab label="Optimizer" />
      </Tabs>
      {currentTab === 0 && (
        <div>
          {renderAccessoryRows()}
        </div>
      )}
      {currentTab === 1 && (
        <EngravingGrid
          selectedEngravings={selectedEngravings}
          accessoryEngravings={accessoryEngravings}
          accessoryLevels={accessoryLevels}
          engravingItems={engravingItems}
          negativeEngravings={negativeEngravings}
        />
      )}
      {currentTab === 2 && renderOptimizer()}
      {currentTab === 2 && renderRemainingValues()}
      <ClearDialog
        open={confirmClearDialogOpen}
        onClose={handleToggleConfirmClearDialog}
        onConfirm={handleClearAllDataConfirmed}
      />
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => handleToggleConfirmDeleteDialog('')}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'var(--chip-background-color)',
            color: 'var(--primary-text-color)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'var(--primary-text-label-color)' }}>Confirm Delete Preset</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete the preset &quot;{presetToDelete}&quot;?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggleConfirmDeleteDialog('')} sx={{ color: 'inherit' }}>
            Cancel
          </Button>
          <Button onClick={handleDeletePresetConfirmed} sx={{ color: 'inherit' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default EngravingCalculator;