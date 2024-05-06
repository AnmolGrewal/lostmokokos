/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Raid } from '../../pages/raids/raidsInfo';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx'; // Import clsx for conditional class names
import Link from 'next/link'; // Import Link from next.js for client-side routing

interface RaidGridProps {
  raid: Raid;
  hasHardVersion: boolean;
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid, hasHardVersion }) => {
  const [dimmed, setDimmed] = useState<boolean[][]>(
    Array.from({ length: 2 }, (_, i) => Array(raid.gateData.gold.length).fill(i === 1))
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
        <h2 className="text-primary-text-label-color text-2xl mt-2">
          {raid.label} Raid{' '}
          {(hasHardVersion || raid.path.endsWith('-hard')) && ( // Check if hasHardVersion or raid path ends with '-hard'
            <Link href={raid.path.endsWith('-hard') ? raid.path.replace('-hard', '') : `${raid.path}-hard`}>
              <FontAwesomeIcon
                icon={faSkull}
                className={clsx("text-red-500", "ml-2", { "opacity-25": !raid.path.endsWith('-hard') })}
              />
            </Link>
          )}
        </h2>
      </div>
      <TableContainer component={Paper} sx={{
        width: '100%',
        backgroundColor: 'var(--chip-background-color)',
        color: 'var(--primary-text-color)',
        '.MuiTableCell-root': {
          color: 'var(--primary-text-color)',
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
              <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : ''}>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>{row.category}</TableCell>
                {row.values.map((value, columnIndex) => (
                  <TableCell key={columnIndex} align="center" className={row.category === 'Box Cost' && columnIndex >= 0 ? 'box-cost-cell' : ''}>
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
                          marginRight: '5px',
                          transition: 'width 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.width = '30px'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.width = '20px'; }}
                      />
                      {value}
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" className={row.category === 'Box Cost' ? 'box-cost-cell' : ''} sx={{ borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginRight: '5px' }} />
                    {row.total}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* Gold Earnable row */}
            <TableRow className={rows.length % 2 === 0 ? 'even-row' : ''}>
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
