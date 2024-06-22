import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from 'react';
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { EngravingItem, NegativeEngraving, engravingItems, negativeEngravings } from '../../data/engravings'; // Adjust the import path as needed

interface EngravingGridProps {
  selectedEngravings: string[];
  accessoryEngravings: string[][];
  accessoryLevels: number[][];
  engravingItems: typeof engravingItems;
  negativeEngravings: NegativeEngraving[];
}

const EngravingGrid: React.FC<EngravingGridProps> = ({
  selectedEngravings,
  accessoryEngravings,
  accessoryLevels,
  engravingItems,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  negativeEngravings,
}) => {
  const renderEngravingTable = () => {
    const accessoryOrder = ['Books', 'Ability Stone', 'Necklace', 'Earring', 'Earring', 'Ring', 'Ring'];

    const calculateColumnTotal = (engravingIndex: number) => {
      let total = 0;
      accessoryOrder.forEach((_, accessoryIndex) => {
        const currentAccessoryEngravings = accessoryEngravings[accessoryIndex] || [];
        const currentAccessoryLevels = accessoryLevels[accessoryIndex] || [];
        const engravingIndexInAccessory = currentAccessoryEngravings.findIndex(
          (accessoryEngraving) => accessoryEngraving === selectedEngravings[engravingIndex]
        );
        if (engravingIndexInAccessory !== -1) {
          total += currentAccessoryLevels[engravingIndexInAccessory];
        }
      });
      return total > 0 ? `+${total}` : '';
    };

    return (
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          backgroundColor: 'var(--chip-background-color)',
          color: 'var(--primary-text-color)',
          '.MuiTableCell-root': {
            color: 'var(--primary-text-color)',
            borderBottom: '2px solid var(--primary-text-label-color)',
            paddingLeft: '2px',
            paddingRight: '2px',
          },
        }}
      >
        <Table aria-label="engraving table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px' }}></TableCell>
              {selectedEngravings.map((engraving, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    textAlign: 'center',
                  }}
                >
                  {engraving}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {accessoryOrder.map((accessory, accessoryIndex) => {
              const currentAccessoryEngravings = accessoryEngravings[accessoryIndex] || [];
              const currentAccessoryLevels = accessoryLevels[accessoryIndex] || [];

              return (
                <TableRow key={accessoryIndex} className={accessoryIndex % 2 === 0 ? 'even-row' : ''}>
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
                        src={engravingItems.find((item) => item.label === accessory)?.image}
                        alt={accessory}
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div className="shrink-0 ml-2">{accessory}</div>
                    </div>
                  </TableCell>
                  {selectedEngravings.map((engraving, engravingIndex) => {
                    const engravingIndexInAccessory = currentAccessoryEngravings.findIndex(
                      (accessoryEngraving) => accessoryEngraving === engraving
                    );
                    const engravingValue =
                      engravingIndexInAccessory !== -1 ? `+${currentAccessoryLevels[engravingIndexInAccessory]}` : '';

                    return (
                      <TableCell key={engravingIndex} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                        <span style={{ visibility: engravingValue ? 'visible' : 'hidden' }}>{engravingValue}</span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  textAlign: 'left',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                Totals:
              </TableCell>
              {selectedEngravings.map((_, engravingIndex) => {
                const columnTotal = calculateColumnTotal(engravingIndex);
                return (
                  <TableCell key={engravingIndex} align="center" sx={{ textAlign: 'center', fontSize: '24px' }}>
                    <span style={{ visibility: columnTotal ? 'visible' : 'hidden' }}>{columnTotal}</span>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return <div className="mt-4">{renderEngravingTable()}</div>;
};

export default EngravingGrid;
