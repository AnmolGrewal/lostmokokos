/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Raid } from '../../data/raidsInfo';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import raidsInfo from '../../data/raidsInfo';
import IconButton from '@mui/material/IconButton';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface RaidGridProps {
  raid: Raid;
  hasHardVersion: boolean;
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid, hasHardVersion }) => {
  const [dimmed, setDimmed] = useState<boolean[][] | null>(null);
  const [showDifferences, setShowDifferences] = useState<boolean>(false);

  useEffect(() => {
    if (raid.gateData && raid.gateData.gold && raid.gateData.boxCost) {
      setDimmed([
        Array(raid.gateData.gold.length).fill(false),
        Array(raid.gateData.boxCost.length).fill(true)
      ]);
    }
  }, [raid.gateData, raid.gateData.gold.length, raid.gateData.boxCost.length]);

  if (!dimmed || !raid.gateData) {
    return null;
  }

  const hardVersion = raidsInfo.find(r => r.path === `${raid.path}-hard`);

  const displayValues = (rowIndex: number, columnIndex: number): string => {
    const category = rowIndex === 0 ? 'gold' : 'boxCost';
    const currentValues = raid.gateData[category].map(Number);
    const hardValues = hardVersion && hardVersion.gateData[category] ? hardVersion.gateData[category].map(Number) : [];
  
    if (!showDifferences || !hardVersion || columnIndex >= currentValues.length) {
      return currentValues[columnIndex].toString();
    } else {
      const diff = (hardValues[columnIndex] || 0) - currentValues[columnIndex];
      return `${currentValues[columnIndex]} (${diff >= 0 ? '+' : ''}${diff})`;
    }
  };

  const displayTotalValues = (rowIndex: number): string => {
    const values = raid.gateData?.[rowIndex === 0 ? 'gold' : 'boxCost'].map(Number) || [];
    const hardValues = hardVersion?.gateData?.[rowIndex === 0 ? 'gold' : 'boxCost'].map(Number) || [];
  
    // Use the lesser of the two lengths for safe operation
    const minGateCount = Math.min(values.length, hardValues.length);
  
    if (!showDifferences || !hardVersion) {
      return calculateTotal(values.slice(0, minGateCount), rowIndex).toString();
    } else {
      const totalHard = calculateTotal(hardValues.slice(0, minGateCount), rowIndex);
      const totalCurrent = calculateTotal(values.slice(0, minGateCount), rowIndex);
      const diff = totalHard - totalCurrent;
      return `${totalCurrent} (${diff >= 0 ? '+' : ''}${diff})`;
    }
  };

  const calculateTotal = (values: number[], rowIndex: number): number => {
    if (!dimmed || rowIndex >= dimmed.length || values.length !== dimmed[rowIndex].length) {
      return 0;
    }
  
    return values.reduce((acc, curr, index) => acc + (dimmed[rowIndex][index] ? 0 : curr), 0);
  };
  
  // Update total calculation calls by passing the row index
  const totalGold = raid.gateData ? calculateTotal(raid.gateData.gold, 0) : 0;
  const totalBoxCost = raid.gateData ? calculateTotal(raid.gateData.boxCost, 1) : 0;
  const goldEarned = totalGold - totalBoxCost;

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    setDimmed((currentDimmed) => {
      if (currentDimmed === null) {
        return null;
      }
  
      const updatedRow = [...currentDimmed[rowIndex]];
      updatedRow[columnIndex] = !updatedRow[columnIndex];
      
      return [
        ...currentDimmed.slice(0, rowIndex),
        updatedRow,
        ...currentDimmed.slice(rowIndex + 1)
      ];
    });
  };

  const rows = [
    { category: 'Gold', values: raid.gateData.gold, total: totalGold },
    { category: 'Box Cost', values: raid.gateData.boxCost, total: totalBoxCost }
  ];

  if (!raid.gateData || !dimmed.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full sm:px-4">
      <div className="flex flex-col items-center w-full">
        <img src={raid.imgSrc} alt={`${raid.label} Raid`} className="rounded-full w-48 h-48" />
        <h2 className="text-primary-text-label-color text-2xl flex">
          {raid.label} Raid
          {raid.path.endsWith('-hard') ? ' Hard' : ' Normal'}{' '}
          {hasHardVersion && (
            <div className='flex flex-row h-8'>
              <Link href={raid.path.endsWith('-hard') ? raid.path.replace('-hard', '') : `${raid.path}-hard`}>
                <FontAwesomeIcon
                  icon={faSkull}
                  className={clsx("text-red-500", "ml-2", { "opacity-25": !raid.path.endsWith('-hard') }, "skull-icon")}
                />
              </Link>
              {!raid.path.endsWith('-hard') && (
                <IconButton
                  onClick={() => setShowDifferences(!showDifferences)}
                  aria-label="Show differences"
                  className="ml-2" // Tailwind class for margin left
                >
                  <CompareArrowsIcon className={clsx("text-red-500", {"opacity-25": !showDifferences, "opacity-100": showDifferences})} />
                </IconButton>
              )}
            </div>
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
            {raid.gateData.itemLevels.length === 1 ? (
              <TableRow>
                <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  Item Level: {raid.gateData.itemLevels[0]}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px', width: '10%' }}>Category</TableCell>
              {raid.gateData.gold.map((_, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', width: `${90 / raid.gateData.gold.length}%`, borderBottom: '2px solid var(--primary-text-label-color)' }}>Gate {index + 1}</TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '24px', width: '10%', borderBottom: '2px solid var(--primary-text-label-color)' }}>Total</TableCell>
            </TableRow>
            {raid.gateData.itemLevels.length > 1 ? (
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>Item Level</TableCell>
                {raid.gateData.itemLevels.map((level, index) => (
                  <TableCell key={index} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>{level}</TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}></TableCell>
              </TableRow>
            ) : null}
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
                      />
                      {showDifferences ? displayValues(rowIndex, columnIndex) : value}
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" className={row.category === 'Box Cost' ? 'box-cost-cell' : ''} sx={{ borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginRight: '5px' }} />
                    {showDifferences ? displayTotalValues(rowIndex) : row.total}
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
