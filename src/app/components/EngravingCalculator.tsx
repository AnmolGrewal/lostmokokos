/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Autocomplete, Chip, Slider, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { engravings, engravingItems, negativeEngravings } from '../../data/engravings';

const EngravingCalculator: React.FC = () => {
  const [selectedEngravings, setSelectedEngravings] = useState<string[]>([]);
  const [accessoryEngravings, setAccessoryEngravings] = useState<string[][]>([]);
  const [accessoryLevels, setAccessoryLevels] = useState<number[][]>([]);
  const [totalEngravings, setTotalEngravings] = useState<{ [key: string]: number }>({});
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const calculateTotalEngravings = () => {
      const totals: { [key: string]: number } = {};
      accessoryEngravings.forEach((engravingList, accessoryIndex) => {
        engravingList.forEach((engraving, engravingIndex) => {
          if (engraving) {
            totals[engraving] = (totals[engraving] || 0) + accessoryLevels[accessoryIndex][engravingIndex];
          }
        });
      });
      setTotalEngravings(totals);
    };

    calculateTotalEngravings();
  }, [accessoryEngravings, accessoryLevels]);

  const handleEngravingChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    // Find deleted engravings
    const deletedEngravings = selectedEngravings.filter(engraving => !value.includes(engraving));

    // Update accessoryEngravings and accessoryLevels to remove deleted engravings
    const newAccessoryEngravings = accessoryEngravings.map(engravingList =>
      engravingList.map(engraving => (deletedEngravings.includes(engraving) ? '' : engraving))
    );
    const newAccessoryLevels = accessoryLevels.map((levelList, accessoryIndex) =>
      levelList.map((level, engravingIndex) =>
        deletedEngravings.includes(accessoryEngravings[accessoryIndex][engravingIndex]) ? 0 : level
      )
    );

    setSelectedEngravings(value);
    setAccessoryEngravings(newAccessoryEngravings);
    setAccessoryLevels(newAccessoryLevels);
  };

  const handleAccessoryEngravingChange = (accessoryIndex: number, engravingIndex: number) => (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    const newAccessoryEngravings = [...accessoryEngravings];
    const newAccessoryLevels = [...accessoryLevels];

    newAccessoryEngravings[accessoryIndex][engravingIndex] = value || '';
    if (!value) {
      newAccessoryLevels[accessoryIndex][engravingIndex] = 0;
    }

    setAccessoryEngravings(newAccessoryEngravings);
    setAccessoryLevels(newAccessoryLevels);
  };

  const handleAccessoryLevelChange = (accessoryIndex: number, engravingIndex: number) => (event: Event, value: number | number[]) => {
    const newAccessoryLevels = [...accessoryLevels];
    newAccessoryLevels[accessoryIndex][engravingIndex] = value as number;
    setAccessoryLevels(newAccessoryLevels);
  };

  const handleToggleConfirmClearDialog = () => {
    setConfirmClearDialogOpen(!confirmClearDialogOpen);
  };

  const handleClearAllDataConfirmed = () => {
    setSelectedEngravings([]);
    setAccessoryEngravings([]);
    setAccessoryLevels([]);
    setTotalEngravings({});
    handleToggleConfirmClearDialog();
  };

  const renderAccessoryRows = () => {
    const accessoryOrder = ['Book', 'Book', 'Ability Stone', 'Necklace', 'Earring', 'Earring', 'Ring', 'Ring'];
    const accessoryRows = [];
  
    for (let i = 0; i < accessoryOrder.length; i += 2) {
      const accessory1 = accessoryOrder[i];
      const accessory2 = accessoryOrder[i + 1];
  
      const accessoryData1 = engravingItems.find((item) => item.label === accessory1);
      const accessoryData2 = engravingItems.find((item) => item.label === accessory2);
  
      const renderAccessory = (accessoryData: typeof engravingItems[0] | undefined, accessoryIndex: number) => {
        if (!accessoryData) return null;
  
        // Initialize accessoryEngravings and accessoryLevels for the current accessory if not already initialized
        if (!accessoryEngravings[accessoryIndex]) {
          accessoryEngravings[accessoryIndex] = Array(accessoryData.values.length).fill('');
        }
        if (!accessoryLevels[accessoryIndex]) {
          accessoryLevels[accessoryIndex] = Array(accessoryData.values.length).fill(0);
        }
  
        return (
          <div key={accessoryIndex} className="bg-secondary-background-color p-4 mt-4 rounded-lg flex flex-shrink-0 flex-col">
            <div className="flex items-center space-x-4">
              <img src={accessoryData.image} alt={accessoryData.label} className="w-10 h-10 flex-shrink-0" />
              <span className="text-lg text-primary-text-color w-20 flex-shrink-0">{accessoryData.label}</span>
              {accessoryData.values.map((values, engravingIndex) => (
                <div key={engravingIndex} className="flex flex-col flex-1 flex-shrink-0">
                  <Autocomplete
                    options={engravingIndex === 2 ? negativeEngravings.map((engraving) => engraving.label) : selectedEngravings}
                    value={accessoryEngravings[accessoryIndex][engravingIndex] || null}
                    onChange={handleAccessoryEngravingChange(accessoryIndex, engravingIndex)}
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
                      '& .MuiAutocomplete-listbox': {
                        backgroundColor: 'var(--primary-background-color)',
                        color: 'var(--primary-text-color)',
                      },
                      '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
                        color: 'var(--primary-text-label-color)',
                      },
                    }}
                  />
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
                </div>
              ))}
            </div>
          </div>
        );
      };
  
      accessoryRows.push(
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAccessory(accessoryData1, i)}
          {renderAccessory(accessoryData2, i + 1)}
        </div>
      );
    }
  
    return accessoryRows;
  };

  const renderTotalEngravings = () => {
    return Object.entries(totalEngravings).map(([label, total], index) => (
      <div key={index} className="flex flex-col items-center justify-center basis-1/5 p-2 border border-primary-text-color bg-primary-background-color rounded-lg">
        <span className="text-primary-text-color">{label}</span>
        <span className="text-primary-text-color">{total}</span>
      </div>
    ));
  };

  return (
    <div className="bg-primary-background-color p-4 size-full">
      <div className="bg-secondary-background-color p-4 mt-4 rounded-lg flex items-center justify-between">
        <h2 className="text-primary-text-color text-2xl text-center">Total Engravings</h2>
        <IconButton
          onClick={handleToggleConfirmClearDialog}
          size="small"
          sx={{
            color: 'var(--primary-text-color)',
            bgcolor: 'var(--image-background-color)',
            borderRadius: '50%',
            p: '5px',
            '&:hover': { bgcolor: 'var(--primary-background-hover-color)' },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <div className="flex flex-wrap justify-center">
        {renderTotalEngravings()}
      </div>
      <div className="bg-secondary-background-color p-4 rounded-lg mt-4">
        <Autocomplete
          multiple
          options={engravings.map((engraving) => engraving.label)}
          value={selectedEngravings}
          onChange={handleEngravingChange}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option}
                  {...tagProps}
                  className="bg-chip-background-color text-chip-text-color text-lg mr-2 mt-2"
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
            '& .MuiAutocomplete-listbox': {
              backgroundColor: 'var(--primary-background-color)',
              color: 'var(--primary-text-color)',
            },
            '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
              color: 'var(--primary-text-label-color)',
            },
          }}
        />
      </div>
      <div className="mt-4">
        {renderAccessoryRows()}
      </div>

      <Dialog
        open={confirmClearDialogOpen}
        onClose={handleToggleConfirmClearDialog}
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
          <Button onClick={handleToggleConfirmClearDialog} sx={{ color: 'inherit' }}>
            Cancel
          </Button>
          <Button onClick={handleClearAllDataConfirmed} sx={{ color: 'inherit' }}>
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EngravingCalculator;
