/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Autocomplete, Chip, Slider, TextField } from '@mui/material';
import { engravings, engravingItems, negativeEngravings } from '../../data/engravings';

const EngravingCalculator: React.FC = () => {
  const [selectedEngravings, setSelectedEngravings] = useState<string[]>([]);
  const [accessoryEngravings, setAccessoryEngravings] = useState<string[][]>([]);
  const [accessoryLevels, setAccessoryLevels] = useState<number[][]>([]);

  const handleEngravingChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setSelectedEngravings(value);
  };

  const handleAccessoryEngravingChange = (accessoryIndex: number, engravingIndex: number) => (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    const newAccessoryEngravings = [...accessoryEngravings];
    newAccessoryEngravings[accessoryIndex][engravingIndex] = value || '';
    setAccessoryEngravings(newAccessoryEngravings);
  };

  const handleAccessoryLevelChange = (accessoryIndex: number, engravingIndex: number) => (event: Event, value: number | number[]) => {
    const newAccessoryLevels = [...accessoryLevels];
    newAccessoryLevels[accessoryIndex][engravingIndex] = value as number;
    setAccessoryLevels(newAccessoryLevels);
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
          <div key={accessoryIndex} className="bg-secondary-background-color p-4 mt-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src={accessoryData.image} alt={accessoryData.label} className="w-10 h-10 flex-shrink-0" />
              <span className="text-lg text-primary-text-color w-20 flex-shrink-0">{accessoryData.label}</span>
              {accessoryData.values.map((values, engravingIndex) => (
                <div key={engravingIndex} className="flex flex-col flex-grow flex-shrink-0">
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
                        }}
                        // className="flex-grow"
                      />
                    )}
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

  return (
    <div className="bg-primary-background-color p-4 min-h-screen" style={{ width: 'calc(100vw)' }}>
      <h2 className="text-primary-text-color text-2xl mt-2 text-center">Engravings</h2>
      <div className="bg-secondary-background-color p-4 rounded-lg">
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
                  className="bg-chip-background-color text-chip-text-color"
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
              }}
            />
          )}
          className=""
        />
      </div>
      <div className="mt-4">
        {renderAccessoryRows()}
      </div>
    </div>
  );
};

export default EngravingCalculator;