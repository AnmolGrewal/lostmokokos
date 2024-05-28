/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, Chip, Slider, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Tab, Tabs } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { engravings, engravingItems, negativeEngravings } from '../../data/engravings';
import EngravingGrid from './EngravingGrid';
import ClearDialog from './ClearDialog';

interface Engravings {
  selectedEngravings: string[];
  accessoryEngravings: string[][];
  accessoryLevels: number[][];
  totalEngravings: { [key: string]: number };
}

interface Preset {
  name: string;
  index: number;
  engravings: Engravings;
}

const EngravingCalculator: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [selectedEngravings, setSelectedEngravings] = useState<string[]>([]);
  const [accessoryEngravings, setAccessoryEngravings] = useState<string[][]>([]);
  const [accessoryLevels, setAccessoryLevels] = useState<number[][]>([]);
  const [totalEngravings, setTotalEngravings] = useState<{ [key: string]: number }>({});
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState<boolean>(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState<boolean>(false);
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [optimizerValues, setOptimizerValues] = useState<{ [key: string]: number }>({});

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
    setSelectedEngravings(engravings.selectedEngravings);
    setAccessoryEngravings(engravings.accessoryEngravings);
    setAccessoryLevels(engravings.accessoryLevels);
    setTotalEngravings(engravings.totalEngravings);
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
    });
  };

  const handleAccessoryEngravingChange = (accessoryIndex: number, engravingIndex: number) => (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const newAccessoryEngravings = [...accessoryEngravings];
    const newAccessoryLevels = [...accessoryLevels];

    newAccessoryEngravings[accessoryIndex][engravingIndex] = value || '';
    if (!value) {
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
          },
        };
        setPresets([defaultPreset]);
        setSelectedPreset(defaultPreset.name);
        loadEngravings(defaultPreset.engravings);
      }
      handleToggleConfirmDeleteDialog('');
    }
  };

  const renderAccessoryRows = () => {
    const accessoryOrder = ['Books', 'Ability Stone', 'Necklace', 'Earring', 'Earring', 'Ring', 'Ring'];
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

        return (
          <div key={accessoryIndex} className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
            <div className="flex items-center space-x-4 justify-center">
              <img src={accessoryData.image} alt={accessoryData.label} className="w-10 h-10 flex-shrink-0" />
              <span className="text-lg text-primary-text-color min-w-fit flex-shrink-0 accessory-label">{accessoryData.label}</span>
            </div>
            <div className="accessory-row">
              {accessoryData.values.map((values, engravingIndex) => (
                <div key={engravingIndex} className="flex flex-col mt-4 flex-1">
                  <Autocomplete
                    options={engravingIndex === 2 ? negativeEngravings.map((engraving) => engraving.label) : selectedEngravings}
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
                      <div className="flex items-center justify-center mt-2">
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
                      </div>
                      <div className="text-center text-primary-text-label-color mt-1">
                        {accessoryLevels[accessoryIndex][engravingIndex]}
                      </div>
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

  const findCombinationForAll = (remainingValues: { [key: string]: number }) => {
    const combination: { [key: string]: { [key: string]: number } } = {};
    const items = ['Books', 'Ability Stone', 'Necklace', 'Earring1', 'Earring2', 'Ring1', 'Ring2'];
  
    // Initialize combination structure with a maximum of 2 distinct engravings per item
    items.forEach(item => {
      combination[item] = {};
    });
  
    // Helper function to allocate values
    const allocateValues = (engraving: string, values: number[], item: string, maxEngraving1: number, maxEngraving2: number) => {
      for (const value of values) {
        if (remainingValues[engraving] >= value) {
          const currentEngraving1 = Object.values(combination[item])[0] || 0;
          const currentEngraving2 = Object.values(combination[item])[1] || 0;
          const numEngravings = Object.keys(combination[item]).length;
          if (
            numEngravings < 2 &&
            ((currentEngraving1 + value <= maxEngraving1 && currentEngraving2 === 0) ||
              (currentEngraving2 + value <= maxEngraving2 && currentEngraving1 === 0))
          ) {
            combination[item][engraving] = (combination[item][engraving] || 0) + value;
            remainingValues[engraving] -= value;
            if (remainingValues[engraving] <= 0) break;
          }
        }
      }
    };
  
    // Allocate fixed values from accessories
    items.forEach((item, index) => {
      const accessoryEngraving = accessoryEngravings[index];
      const accessoryLevel = accessoryLevels[index];
      if (accessoryEngraving && accessoryLevel) {
        accessoryEngraving.forEach((engraving, engravingIndex) => {
          if (engraving) {
            combination[item][engraving] = accessoryLevel[engravingIndex];
            remainingValues[engraving] -= accessoryLevel[engravingIndex];
          }
        });
      }
    });
  
    // Allocate Books
    const bookLevels = [12, 9, 6, 3];
    selectedEngravings.forEach(engraving => {
      let allocatedBooks = 0;
      if (accessoryEngravings[0].includes(engraving)) {
        // If the engraving is already in books, use the corresponding level
        const engravingIndex = accessoryEngravings[0].indexOf(engraving);
        combination['Books'][engraving] = accessoryLevels[0][engravingIndex];
        allocatedBooks = accessoryLevels[0][engravingIndex];
      } else {
        // Allocate books for engravings not in accessories
        for (const level of bookLevels) {
          if (remainingValues[engraving] >= level && allocatedBooks + level <= 12) {
            combination['Books'][engraving] = level;
            remainingValues[engraving] -= level;
            allocatedBooks += level;
          }
          if (remainingValues[engraving] <= 0 || allocatedBooks === 12) break;
        }
      }
    });
  
    // Ensure each item has a maximum of 2 distinct engravings
    items.forEach(item => {
      const engravings = Object.keys(combination[item]);
      if (engravings.length > 2) {
        const excessEngravings = engravings.slice(2);
        excessEngravings.forEach(excessEngraving => {
          remainingValues[excessEngraving] += combination[item][excessEngraving];
          delete combination[item][excessEngraving];
        });
      }
    });
  
    // Optimize the allocation to reach the total required for each engraving
    const optimizeAllocation = () => {
      const stoneLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  
      selectedEngravings.forEach(engraving => {
        let remaining = remainingValues[engraving];
        if (remaining > 0) {
          // Try to allocate to books first
          allocateValues(engraving, bookLevels, 'Books', 12, 12);
  
          // Allocate +6 to engraving 1 on all accessories first
          items.slice(2).forEach(item => {
            allocateValues(engraving, [6], item, 6, 3);
          });
  
          // Then allocate +3 to engraving 2 on all accessories
          items.slice(2).forEach(item => {
            if (Object.keys(combination[item]).length < 2) {
              allocateValues(engraving, [3], item, 6, 3);
            }
          });
  
          // Then try to allocate to ability stone
          allocateValues(engraving, stoneLevels, 'Ability Stone', 10, 10);
        }
      });
    };
  
    optimizeAllocation();
  
    return combination;
  };                  
  
  const renderCombinationNeeded = () => {
    const remainingValues = calculateRemainingValues();
    const combination = findCombinationForAll(remainingValues);
  
    return (
      <div className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
        <h2 className="text-primary-text-color text-2xl text-center">Combination Needed</h2>
        <div className="flex flex-wrap justify-center">
          {['Books', 'Ability Stone', 'Necklace', 'Earring1', 'Earring2', 'Ring1', 'Ring2'].map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2 border border-primary-text-color bg-primary-background-color rounded-lg m-2">
              <span className="text-primary-text-color">{item}</span>
              {Object.entries(combination[item]).map(([engraving, value], engravingIndex) => (
                value > 0 && <span key={engravingIndex} className="text-primary-text-color">{engraving}: +{value}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };  

  const renderRemainingValues = () => {
    const remainingValues = calculateRemainingValues();

    return (
      <div className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
        <h2 className="text-primary-text-color text-2xl text-center">Combination Needed</h2>
        <div className="flex flex-wrap justify-center">
          {Object.entries(remainingValues).map(([label, remaining], index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2 border border-primary-text-color bg-primary-background-color rounded-lg m-2">
              <span className="text-primary-text-color">{label}</span>
              <span className="text-primary-text-color">{remaining > 0 ? remaining : 'Achieved'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const renderOptimizer = () => {
    const rows = [];
    for (let i = 0; i < selectedEngravings.length; i += 3) {
      rows.push(selectedEngravings.slice(i, i + 3));
    }

    return (
      <div className="mt-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-wrap justify-center">
            {row.map((engraving, index) => (
              <div key={index} className="flex flex-col items-center mb-4 mx-2 flex-1">
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
        ))}
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
      {currentTab === 2 && renderCombinationNeeded()}
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
    </div>
  );
};

export default EngravingCalculator;