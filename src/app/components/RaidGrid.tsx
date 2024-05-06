/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Raid } from '../../pages/raids/raidsInfo'; // Adjust the import path as necessary

interface RaidGridProps {
  raid: Raid;
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid }) => {
  const [dimmed, setDimmed] = useState<boolean[][]>(
    Array.from({ length: 2 }, () => Array(raid.gateData.gold.length).fill(false))
  );

  const totalGold = raid.gateData.gold.map((_, index) => 
    dimmed[0][index] ? 0 : raid.gateData.gold[index]
  ).reduce((acc, curr) => acc + curr, 0);

  const totalBoxCost = raid.gateData.boxCost.map((_, index) => 
    dimmed[1][index] ? 0 : raid.gateData.boxCost[index]
  ).reduce((acc, curr) => acc + curr, 0);

  const goldEarned = totalGold - totalBoxCost;

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    const updatedDimmed = [...dimmed];
    updatedDimmed[rowIndex][columnIndex] = !updatedDimmed[rowIndex][columnIndex];
    setDimmed(updatedDimmed);
  };

  const rows = [
    { category: 'Gold', values: raid.gateData.gold, total: totalGold },
    { category: 'Box Cost', values: raid.gateData.boxCost, total: totalBoxCost }
  ];

  return (
    <div className="flex flex-col items-center w-full px-4">
      <div className="flex flex-col items-center w-full">
        <img src={raid.imgSrc} alt={`${raid.label} Raid`} className="rounded-full w-48 h-48" />
        <h2 className="text-primary-text-label-color text-2xl mt-2">{raid.label} Raid</h2>
      </div>
      <TableContainer component={Paper} sx={{
        width: '100%',
        backgroundColor: 'var(--chip-background-color)',
        color: 'var(--primary-text-color)',
        '.MuiTableCell-root': {
          color: 'var(--primary-text-color) !important',
          borderBottom: '2px solid var(--primary-text-label-color)',
          paddingLeft: 2,
          paddingRight: 2
        }
      }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px', width: '10%' }}>Category</TableCell>
              {raid.gateData.gold.map((_, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', width: `${80 / (raid.gateData.gold.length + 1)}%` }}>Gate {index + 1}</TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '24px', width: `${80 / (raid.gateData.gold.length + 1)}%` }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>{row.category}</TableCell>
                {row.values.map((value, columnIndex) => (
                  <TableCell key={columnIndex} align="center">
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative',
                        opacity: dimmed[rowIndex][columnIndex] ? 0.5 : 1,
                        cursor: 'pointer',
                        transition: 'opacity 0.3s ease'
                      }} 
                      onClick={() => handleCellClick(rowIndex, columnIndex)}
                    >
                      <img 
                        src="https://i.imgur.com/DI98qp1.png" 
                        alt="Gold Icon" 
                        style={{ 
                          width: '20px', 
                          marginRight: '5px'
                        }} 
                      />
                      {value}
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginRight: '5px' }} />
                    {row.total}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* Gold Earned row */}
            <TableRow>
              <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                Gold Earnable: {goldEarned}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RaidGrid;
